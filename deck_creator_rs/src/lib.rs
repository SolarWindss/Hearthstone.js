//! A Rust implementation of the Hearthstone.js Deck Creator.

#![warn(missing_docs, rustdoc::missing_crate_level_docs)]

pub mod lib {
    //! The library of the Deck Creator

    use console::Term;
    use lazy_static::lazy_static;
    use regex::Regex;
    use serde_json::{self, Value};
    use std::{error::Error, fs, io::Write};

    use walkdir::WalkDir;

    const CARDS_DIR: &str = "../cards";

    fn capitalize(s: &str) -> String {
        let mut c = s.chars();
        match c.next() {
            None => String::new(),
            Some(f) => f.to_uppercase().collect::<String>() + c.as_str().to_lowercase().as_str(),
        }
    }

    /// Writes `prompt` to `term`, and returns some user input.
    ///
    /// The prompt is written as-is. No added newlines.
    ///
    /// # Examples
    /// ```
    /// # use deck_creator_rs::lib;
    /// # use console::Term;
    /// let mut term = Term::stdout();
    ///
    /// let user = lib::input(&mut term, "Example? ")?;
    ///
    /// // Writes the user input to term
    /// term.write_line(&user)?;
    /// // Example? Foo
    /// // Foo
    /// # Ok::<(), Box<dyn std::error::Error>>(())
    /// ```
    pub fn input(term: &mut Term, prompt: &str) -> Result<String, Box<dyn Error>> {
        if let Err(e) = term.write(prompt.as_bytes()) {
            return Err(Box::new(e));
        }

        // Read line
        let user = match term.read_line() {
            Err(e) => return Err(Box::new(e)),
            Ok(u) => u,
        };

        Ok(user)
    }

    fn extract_json_from_card(text: &str) -> Result<String, Box<dyn Error>> {
        lazy_static! {
            // Todo: Make this use correct error handling if possible
            static ref COMMENT_RE: Regex = Regex::new(r"(?sm)(//.*?$|/\*.*?\*/)").unwrap();
            static ref FIELD_RE: Regex = Regex::new(r"(?m)^(.*?)(\w*)(: .*?)$").unwrap();
            static ref LAST_FIELD_RE: Regex = Regex::new(r",\n}$").unwrap();
            static ref FUNCTIONS_END_RE: Regex = Regex::new(r"\r?\n\s*?\r?\n\s*?").unwrap();
        };

        // Remove comments
        let cleaned_text = COMMENT_RE.replace_all(text, "");

        // Remove trailing and leading whitespace
        let mut cleaned_text = cleaned_text.trim().to_string();

        // Remove everything above `module.exports = `.
        cleaned_text = cleaned_text
            .split("module.exports = ")
            .nth(1)
            .ok_or("module.exports not found.")?
            .to_string();

        // Remove module.exports
        cleaned_text = cleaned_text.replace("module.exports = ", "");

        // Remove functions
        let mut result: String = FUNCTIONS_END_RE
            .split(&cleaned_text)
            .next()
            .ok_or("Failed to split on double newline.")?
            .trim()
            .to_string();

        // Remove the last comma
        if result.ends_with(',') {
            result.pop();
            result.push_str("\n}");
        } else {
            result = LAST_FIELD_RE.replace(&result, "\n}").to_string();
        }

        // Now double-quote the keys
        result = FIELD_RE.replace_all(&result, "$1\"$2\"$3").to_string();

        Ok(result)
    }

    /// Finds and returns all cards from the cards folder
    pub fn find_cards() -> Result<Vec<Value>, Box<dyn Error>> {
        let mut found: Vec<Value> = vec![];

        for entry in WalkDir::new(CARDS_DIR).into_iter().filter_map(|e| e.ok()) {
            if entry.file_type().is_file() {
                let filename = match entry.file_name().to_str() {
                    None => continue,
                    Some(t) => t,
                };

                // If the file is not a .js file, ignore it.
                if !filename.contains(".js") {
                    continue;
                }

                let path = entry.path();
                let mut text = fs::read_to_string(path)?;

                // Ignore test cards.
                let path_str = path.to_str().unwrap_or("");
                if path_str.contains("cards/Tests/") || path_str.contains("cards/Examples/") {
                    continue;
                }

                // We don't care about uncollectible cards.
                // Removed since we want to keep the starting heroes.
                /*if text.contains("uncollectible: true") && !text.contains(" Starting Hero\",") {
                    continue;
                }*/

                text = extract_json_from_card(&text)?;
                let parsed = serde_json::from_str(&text)?;

                found.push(parsed);
            }
        }

        Ok(found)
    }

    /// Filter away values from `cards`.
    ///
    /// # Example
    /// ```
    /// # use deck_creator_rs::lib;
    /// #
    /// let cards = lib::find_cards()?;
    ///
    /// let filtered_cards = lib::filter_cards(&cards, &mut |card| {
    ///     card.get("spellClass").is_some()
    /// });
    /// # Ok::<(), Box<dyn std::error::Error>>(())
    /// ```
    pub fn filter_cards<T>(cards: &[Value], callback: &mut T) -> Vec<Value>
    where
        T: FnMut(&Value) -> bool,
    {
        cards
            .iter()
            .filter(|card| callback(card))
            .map(|f| f.to_owned())
            .collect()
    }

    /// Filter away uncollectible cards.
    pub fn filter_uncollectible(cards: &[Value]) -> Vec<Value> {
        filter_cards(cards, &mut |card| {
            card.get("uncollectible").map_or(false, |uncollectible| {
                uncollectible.as_bool().unwrap_or(false)
            })
        })
    }

    /// Finds and returns the classes
    ///
    /// # Example
    /// ```
    /// # use deck_creator_rs::lib;
    /// let cards = lib::find_cards()?;
    /// let classes = lib::find_classes(&cards);
    ///
    /// assert_eq!(classes, vec!["Death Knight", "Demon Hunter", /* ... */]);
    /// # Ok::<(), Box<dyn std::error::Error>>(())
    /// ```
    pub fn find_classes(cards: &[Value]) -> Vec<String> {
        let mut classes: Vec<String> = vec![];

        let cards = filter_cards(cards, &mut |card| {
            //println!("{:#?}", card["name"].as_str().map_or("", |name| name));
            card["name"]
                .as_str()
                .map_or(false, |name| name.contains(" Starting Hero"))
        });

        for card in cards.iter() {
            if let Some(name) = card.get("name") {
                if let Some(name) = name.as_str() {
                    classes.push(name.to_owned().replace(" Starting Hero", ""));
                }
            }
        }

        classes
    }

    /// Asks the user to pick a class.
    ///
    /// # Example
    /// ```
    /// # use deck_creator_rs::lib;
    /// # use console::Term;
    /// let mut term = Term::stdout();
    ///
    /// let cards = lib::find_cards()?;
    /// let classes = lib::find_classes(&cards);
    ///
    /// let (class, runes) = lib::pick_class(&mut term, &classes)?;
    /// # Ok::<(), Box<dyn std::error::Error>>(())
    /// ```
    pub fn pick_class(
        term: &mut Term,
        classes: &[String],
    ) -> Result<(String, String), Box<dyn Error>> {
        let ask = format!(
            "What class do you want to choose?\n{}\n",
            &classes.join(", ")
        );
        let class = input(term, &ask)?;

        // Capitalize every word
        let class = class
            .split(' ')
            .map(capitalize)
            .collect::<Vec<String>>()
            .join(" ");

        // Check if the user input in lowercase matches any class
        classes
            .iter()
            .map(|class| class.to_lowercase())
            .collect::<Vec<String>>()
            .contains(&class.to_lowercase())
            .then_some(0)
            .ok_or("Invalid class")?;

        let mut runes = "".to_string();

        // If the class is `Death Knight`
        let rune_classes = ["death knight"];
        if rune_classes.contains(&class.to_lowercase().as_str()) {
            while runes.chars().count() < 3 {
                let rune_question = format!(
                    "What runes do you want to add ({} more)\nBlood, Frost, Unholy\n",
                    3 - runes.chars().count()
                );
                let rune = input(term, &rune_question)?;
                let rune = rune.chars().next().ok_or("Invalid rune")?;

                runes.push(rune);
            }
        }

        runes = runes.to_uppercase();

        Ok((class, runes))
    }

    /*
    pub fn show_cards(cards: &[Value], class: &String) -> Result<(), Box<dyn Error>> {
        todo!()
    }
    */
}
