#### 2.0.0-stable (2023-12-31)

#### 2.0.0-beta.8 (2023-12-30)

##### Chores

*  update dependency ([6c983e11](https://github.com/LunarTides/Hearthstone.js/commit/6c983e11d3214321f508b9cd5f127f8a314cef11))
*  update dependencies ([58b7c670](https://github.com/LunarTides/Hearthstone.js/commit/58b7c670cbc675687aea8e8934ff7eae0ac004e3))
*  bump version to 2.0.0-beta.8 ([34373561](https://github.com/LunarTides/Hearthstone.js/commit/34373561fe105cb21b5e079273ae1d8dd4c99055))

##### Bug Fixes

*  remove require-jsdoc from card files ([f7b2bfb9](https://github.com/LunarTides/Hearthstone.js/commit/f7b2bfb9fe42a7b58c1cabe02f714e86e1f2a8af))
*  move heropower cards into mana cost folders ([88f4ec9c](https://github.com/LunarTides/Hearthstone.js/commit/88f4ec9caea7c99af3a2eda4f90f5d52691f3b29))
*  default `dcShowUncollectible` to false ([a4c2a7e0](https://github.com/LunarTides/Hearthstone.js/commit/a4c2a7e0939a9930d64e9134243d265648c3f3a0))
*  move heropower cards from spells folder ([3885043d](https://github.com/LunarTides/Hearthstone.js/commit/3885043d942de057c101f9d828fa9054fbe4ce42))
*  allow giving cards starting with a number ([bdc50dbd](https://github.com/LunarTides/Hearthstone.js/commit/bdc50dbd9ac145731cbacc45f73708355a94bd57))
*  fix spelldamage where damage > 9 ([ff2f7be9](https://github.com/LunarTides/Hearthstone.js/commit/ff2f7be97608394b465f6e36904cead60d63c998))
* **card:**
  *  make galakrond heropower cards uncollectible ([247c2e27](https://github.com/LunarTides/Hearthstone.js/commit/247c2e279c7001de5b76392b5c153d4000c7b31d))
  *  fix memory leaks in simple card reference example ([a443e52e](https://github.com/LunarTides/Hearthstone.js/commit/a443e52e8fa6c0f3b2f188b7e833380d6ad9ba0b))
* **dc:**  fix error message when exiting using command ([841252bd](https://github.com/LunarTides/Hearthstone.js/commit/841252bdb491af530f4ca676543aacaccaa236a9))

##### Other Changes

*  finish adding docstrings to remaining functions ([97da9331](https://github.com/LunarTides/Hearthstone.js/commit/97da9331ebade83ca8dcaea635ec8aefb5a6038b))
*  start mandating docstrings ([95daf1de](https://github.com/LunarTides/Hearthstone.js/commit/95daf1de7349e8437dc5474acb0315d70cc29da6))

##### Refactors

*  add cardIds file to make hardcoding ids less painful ([d599794f](https://github.com/LunarTides/Hearthstone.js/commit/d599794f49a352677915d96d2ca655d3f79d5fea))
*  remove detecting/upgrading .js/.mts files ([d1e51b23](https://github.com/LunarTides/Hearthstone.js/commit/d1e51b231a2be5f7ea3a12e56b4480bc4ac6821d))
*  revamp hub watermark ([1d284e38](https://github.com/LunarTides/Hearthstone.js/commit/1d284e3822d41a22e7048b3fd54809732ddb2198))
*  put idscript in a loop ([bb1082b4](https://github.com/LunarTides/Hearthstone.js/commit/bb1082b434ce5e226178b3e37658b317ba2872a1))
* **dc:**
  *  make import command take an argument ([c6faa0a0](https://github.com/LunarTides/Hearthstone.js/commit/c6faa0a0365ac4e81f5c27409c86123156541005))
  *  make warning its own command ([fadff432](https://github.com/LunarTides/Hearthstone.js/commit/fadff432b25d71a100dfe43fb890c840a172a925))
  *  rewrite the command system ([3b830f82](https://github.com/LunarTides/Hearthstone.js/commit/3b830f82d62493d06457ecd56bf16a9d626b5600))

##### Tests

*  add more tests to cards ([9bc14681](https://github.com/LunarTides/Hearthstone.js/commit/9bc14681bb7821f172a573dbe51a8f158a10256b))

#### 2.0.0-beta.7 (2023-12-19)

##### Chores

*  add todos to config ([cff359c2](https://github.com/LunarTides/Hearthstone.js/commit/cff359c205bd3295adbeb21dd29c0775dd9d4465))
*  update vanillatypes dependancy to 3.0.0 ([06e5dae0](https://github.com/LunarTides/Hearthstone.js/commit/06e5dae0913026b37a5633ad1fdbaaba00e9c0c4))
*  update dependencies ([69d2aa4c](https://github.com/LunarTides/Hearthstone.js/commit/69d2aa4c80f9092c8520c2ec605155ca41806e65))
*  rename runner to hub for clarity ([a5265eaa](https://github.com/LunarTides/Hearthstone.js/commit/a5265eaa21c914b29d3eef0516ecd48946bdabc4))
*  bump version to 2.0.0-beta.7 ([2f2f8fcd](https://github.com/LunarTides/Hearthstone.js/commit/2f2f8fcda0d68417ac3a608b6b6dde6747284762))

##### New Features

* **script:**  add argument to not filter cards in vc generator ([5505d7e9](https://github.com/LunarTides/Hearthstone.js/commit/5505d7e9d924a6b9cddfdb2000258e0893d095ec))

##### Bug Fixes

* **cclib:**  escape ' in fields ([20b56a66](https://github.com/LunarTides/Hearthstone.js/commit/20b56a666f0d9c826aa34bb68489c0626880992d))
*  fix location card immortality ([ad43b55f](https://github.com/LunarTides/Hearthstone.js/commit/ad43b55fb211df16933730fbd1f4a5e985e9db32))
*  fix diy 1 verification ([4c98a708](https://github.com/LunarTides/Hearthstone.js/commit/4c98a708b3cf6c711e31d01fb8a74ab537b749fe))
*  fix singular xo issue ([35c50bcd](https://github.com/LunarTides/Hearthstone.js/commit/35c50bcda6c33ba2949737d61b4a677363e7cb86))

##### Other Changes

*  make yesNoQuestion player argument optional ([224ca471](https://github.com/LunarTides/Hearthstone.js/commit/224ca471534f16b4784c0d47ac17b74cbff5643a))
* generate instead of generator ([264ce4ad](https://github.com/LunarTides/Hearthstone.js/commit/264ce4ad5c91bde0d2facac77083013c4e069242))
*  change the type of HeroPower event to Card ([e5f29e93](https://github.com/LunarTides/Hearthstone.js/commit/e5f29e93c862cf6fb00074959172f77bdb8003a3))
*  fix example cards readme file ([d4d3c4af](https://github.com/LunarTides/Hearthstone.js/commit/d4d3c4afcde07ff2ad8430fc432246396e3221d0))
*  add hero powers to their own card type ([76415838](https://github.com/LunarTides/Hearthstone.js/commit/764158381b3e338a35f73b8a2f7f51c908f99eb8))
*  add armor to hero blueprints ([6c23f583](https://github.com/LunarTides/Hearthstone.js/commit/6c23f583b6759b7049609bbf9db025161887f0af))
*  improve example cards even more ([3d5ebcd6](https://github.com/LunarTides/Hearthstone.js/commit/3d5ebcd6e73fa859d6523082bd8f0ec4bdaf6ace))
*  more small improvements to example cards ([0e1f2aa0](https://github.com/LunarTides/Hearthstone.js/commit/0e1f2aa045f45c55b072ab8a50140c2b2255d2aa))
*  small improvements to example cards ([fa1ca87e](https://github.com/LunarTides/Hearthstone.js/commit/fa1ca87ecb9ecd46a28b680f773a0a1ca84c5db5))
*  reenable use of console.log ([a55c6877](https://github.com/LunarTides/Hearthstone.js/commit/a55c6877430fb4eb3eeed099a39960daac14bb59))
*  rename uncollectible to collectible ([50a89483](https://github.com/LunarTides/Hearthstone.js/commit/50a89483fe6ecac756d32e64f41a0b62603193e2))

##### Refactors

*  remove "reload" debug command ([f88a0237](https://github.com/LunarTides/Hearthstone.js/commit/f88a023782d29f565e817b2da33074dfaaa3cee4))
*  improve todo system ([f2126b05](https://github.com/LunarTides/Hearthstone.js/commit/f2126b051d634748c91d5036c2e16a16081dcf9b))
*  remove trailing newline from watermark ([cafbbb9b](https://github.com/LunarTides/Hearthstone.js/commit/cafbbb9ba645787b59717802ae3d210b77225b40))
*  add 'openInBrowser' util function, change licenseUrl to githubUrl ([d03c9701](https://github.com/LunarTides/Hearthstone.js/commit/d03c970166f9839bd7d1755731e7d1244f9703a6))
*  remove "set" debug command ([4b2e7bcd](https://github.com/LunarTides/Hearthstone.js/commit/4b2e7bcdafc21580bba4a993dba4b5fdeeefdc81))
*  remove "cmd" debug command ([1ab1c84b](https://github.com/LunarTides/Hearthstone.js/commit/1ab1c84bce6a0a9d2f4ad89506238015c30c10a6))
*  remove "debug" debug command ([b918e187](https://github.com/LunarTides/Hearthstone.js/commit/b918e187386551452103fb1be16d243f4f19090b))
*  move licenseUrl to the config file ([ae6c09cf](https://github.com/LunarTides/Hearthstone.js/commit/ae6c09cf40997a58114c89020ee8c469d20608ff))
*  add arguments to getRandomTarget ([e2a6a013](https://github.com/LunarTides/Hearthstone.js/commit/e2a6a013de65177d44408396912e20595340391c))
*  dont show corpses for players if they cant use them ([4d9ee808](https://github.com/LunarTides/Hearthstone.js/commit/4d9ee8082635e70ca61f5dfdc7b281abef61b8a8))
*  make corpse / runes supported classes less hardcoded ([1891ea3d](https://github.com/LunarTides/Hearthstone.js/commit/1891ea3db8dfc1a446e89286f32f1a4bf941a21a))
*  make the blueprint format more consistant ([444192bb](https://github.com/LunarTides/Hearthstone.js/commit/444192bb1f05d4095aea6941cec908f046d7f80e))
* **script:**
  *  improve processing message in propfinder ([ab26a75c](https://github.com/LunarTides/Hearthstone.js/commit/ab26a75c09c4ba0405f4a1e8c672e2ea7f6ff074))
  *  update propfinder to find everything at once ([4f497da4](https://github.com/LunarTides/Hearthstone.js/commit/4f497da413c849dbe4878efc5289e5999f4dbb42))

#### 2.0.0-beta.6 (2023-12-01)

##### Chores

*  update dependancies ([13455f1a](https://github.com/LunarTides/Hearthstone.js/commit/13455f1ab457f37d7807c809e0f011a14716601a))
*  change Card.name doc to reflect new non-uniqueness ([69db3e30](https://github.com/LunarTides/Hearthstone.js/commit/69db3e30717131745e2b41de3fbf423201852ba6))
*  bump build number to 6 ([989da702](https://github.com/LunarTides/Hearthstone.js/commit/989da70271a6a2cbf21b7703dbcb0df16923c6d6))

##### Continuous Integration

*  update node version to hopefully fix failing ci ([13a335bc](https://github.com/LunarTides/Hearthstone.js/commit/13a335bc1088dbbd63f411a8c0398af270d4e0fa))

##### New Features

*  add fancy shortcuts to the eval command ([cc29764d](https://github.com/LunarTides/Hearthstone.js/commit/cc29764d37b00b8299f72375c449f0c0db919054))
*  add id and uuid to readable cards when in debug mode ([a910ec8b](https://github.com/LunarTides/Hearthstone.js/commit/a910ec8b065ac6f08effc0d413d1e2d932c9c5e9))
*  add a deck ([#342](https://github.com/LunarTides/Hearthstone.js/pull/342)) ([cbeb34df](https://github.com/LunarTides/Hearthstone.js/commit/cbeb34df2bb47e310efc7d481d2d683fc0dc9b6d))
*  add Card.takeControl method ([7b84b027](https://github.com/LunarTides/Hearthstone.js/commit/7b84b0271ff63ad38f617810779d3c734070916f))
*  add titan event ([25548a3b](https://github.com/LunarTides/Hearthstone.js/commit/25548a3b3f9d4a7e70ec7b67f809b80bf341f769))
*  add titan keyword ([5825b759](https://github.com/LunarTides/Hearthstone.js/commit/5825b7592b6c088454648999be39c4ebb74a221c))
*  add CardEvent event ([4e93e35f](https://github.com/LunarTides/Hearthstone.js/commit/4e93e35fb77fd01c669f826c22aea851b40ff0cd))
*  add getRandomTarget util function ([f8e1ac32](https://github.com/LunarTides/Hearthstone.js/commit/f8e1ac328a86bf568e482cd56d2e239afa820097))
*  add getRemainingHandSize util function ([2badeca0](https://github.com/LunarTides/Hearthstone.js/commit/2badeca077f15c604e26c0c93556fd2ce0951657))
*  add getRemainingBoardSpace util function ([9c9023d0](https://github.com/LunarTides/Hearthstone.js/commit/9c9023d00505498dd8af7bcf5ed7f928f92b4f32))
* **script:**  add spellSchool and hpCost to upgradecards ([e757973a](https://github.com/LunarTides/Hearthstone.js/commit/e757973a5837936ab5f79d4e84b88e90cb11754e))

##### Bug Fixes

*  prevent fromTags from crashing when using special tags ([e96664d1](https://github.com/LunarTides/Hearthstone.js/commit/e96664d1580fe9842ff1443d9d37eed28d5e73cd))
*  update cards to use ids ([c3e2d0ff](https://github.com/LunarTides/Hearthstone.js/commit/c3e2d0ffc1476362c61c91ebef306e802d3d1597))
*  add titan command to help command ([b54cb8d3](https://github.com/LunarTides/Hearthstone.js/commit/b54cb8d3fbb2dbe8259168383a595057a777d4bc))
* **uc:**  work better with xo ([f38e07dc](https://github.com/LunarTides/Hearthstone.js/commit/f38e07dce9e8c0ab05c3dad69bbd59a9cad303ae))
* **ai:**
  *  use canAttack and canTargetMinion in more places ([e59e9535](https://github.com/LunarTides/Hearthstone.js/commit/e59e953506285b81565f61cbecd3bec34d7c7fce))
  *  prevent infinite loop in chooseOne ([62f8b704](https://github.com/LunarTides/Hearthstone.js/commit/62f8b7043f5e8a3501fae130eb19a28cad3770fd))
* **dc:**  fix importing not working ([e1d157b7](https://github.com/LunarTides/Hearthstone.js/commit/e1d157b758e2ec05dcbdbb2a33258d26084a78b5))
* **cclib:**  fix xo issues in import blueprint ([9c935812](https://github.com/LunarTides/Hearthstone.js/commit/9c9358123f9764ce5b06e99eb8a8d91aed50530f))
* **script:**  make upgradecards to work with xo ([a5ef98e8](https://github.com/LunarTides/Hearthstone.js/commit/a5ef98e8224541a9c7458e8d32cacc1ec6ba7f22))

##### Other Changes

*  add unordered cards ([47db90c3](https://github.com/LunarTides/Hearthstone.js/commit/47db90c3a69b76f7404eddbc39910ecf84424b2a))
*  split hero cards and hero powers ([5c7acda3](https://github.com/LunarTides/Hearthstone.js/commit/5c7acda3f4e5cb0ff56191cf08e38027c8253264))
*  split stats into attack and health ([ad1773e0](https://github.com/LunarTides/Hearthstone.js/commit/ad1773e054de3f9b662fcc2ed2244faacfaadd26))
*  add cardCollections to game ([41865a13](https://github.com/LunarTides/Hearthstone.js/commit/41865a1349c1c030fda04ecc3a7caa03843ac2b5))
*  add brewing storm and dragon claw cards ([4b1c2fbf](https://github.com/LunarTides/Hearthstone.js/commit/4b1c2fbf8f30514260bc6434d20718cbf97fa3d6))
*  remove CastSpellOnMinion event ([cede02a5](https://github.com/LunarTides/Hearthstone.js/commit/cede02a554d9218a0dc7bc25c417d425a4ab16f6))
*  make all constant variables uppercase ([d70b52e9](https://github.com/LunarTides/Hearthstone.js/commit/d70b52e99379d0101e718a2c9aeb39838168dfe3))

##### Performance Improvements

*  slightly optimize death knight heropwoer test ([1bf264c1](https://github.com/LunarTides/Hearthstone.js/commit/1bf264c1a8b0410c0daeadf2defff28aa7f7ebb1))

##### Refactors

*  add return types to all functions ([6503084e](https://github.com/LunarTides/Hearthstone.js/commit/6503084e539494068fa4052bffc7fad53fa69828))
*  remove displayName and make name non-unique ([161d97c2](https://github.com/LunarTides/Hearthstone.js/commit/161d97c25baca6e350aa51fc5db920d4d3777d79))
*  show history on game end ([b2607e0a](https://github.com/LunarTides/Hearthstone.js/commit/b2607e0a91884277731090ac14a7bd3b8c982fc5))
*  remove some ts-expect-errors ([9626bfca](https://github.com/LunarTides/Hearthstone.js/commit/9626bfca1094a5c777c5be8353f7d46e6f567b4a))
*  make exports.ts exports lowercase ([6fbde3d1](https://github.com/LunarTides/Hearthstone.js/commit/6fbde3d1522225ecdeca7ab6a2099e3af75c2c2e))
*  make game class use this.functions ([84230738](https://github.com/LunarTides/Hearthstone.js/commit/84230738caf5ffc8ff196e2f86a0c283e816c54c))
*  remove useless ? and ! ([ceef5288](https://github.com/LunarTides/Hearthstone.js/commit/ceef5288cd937f2dfd0d47f4259d5d256cb49f87))

##### Reverts

*  make all constant variables uppercase ([3705412f](https://github.com/LunarTides/Hearthstone.js/commit/3705412f3c57b8fd6dc5627e43da2c2a131bfd02))

#### 2.0.0-beta.5 (2023-10-26)

##### Chores

*  update @hearthstonejs/vanillatypes dependancy ([aa854803](https://github.com/LunarTides/Hearthstone.js/commit/aa8548036414fe0f517be7220b7745af3b660ab0))
*  update dependancies ([f5b93caf](https://github.com/LunarTides/Hearthstone.js/commit/f5b93caf61e4765c1d3ce3ad6340069ee7f192a5))
*  bump build number to 5 ([c27de037](https://github.com/LunarTides/Hearthstone.js/commit/c27de03748ead8c7e15c3c8033df68cdaa1ceef4))

##### Bug Fixes

*  fix bug in card.canAttack ([594c5c84](https://github.com/LunarTides/Hearthstone.js/commit/594c5c84088bd7e9384761682ccc34a3cba5f767))
*  negate check for overrideNoInput ([7dbf2920](https://github.com/LunarTides/Hearthstone.js/commit/7dbf2920f4b1f08c27d58141b2cbc9a310b8c9ea))
*  make config file affect deckcode importing ([cf02a072](https://github.com/LunarTides/Hearthstone.js/commit/cf02a072ba24de4c1bc0014f125d55141e71bfff))
*  allow disabling converting tags in fromRarity ([4edeeaef](https://github.com/LunarTides/Hearthstone.js/commit/4edeeaefbe09d95d2d7cefe8af829dc703d0f4d2))
*  allow tags with colons to work with walls ([5b1690b8](https://github.com/LunarTides/Hearthstone.js/commit/5b1690b8cd4db41973b1158002d4d144d1a28d15))
*  tags don't remove partial matches if perfect match exists ([cd272552](https://github.com/LunarTides/Hearthstone.js/commit/cd272552876d5b50b58790ff865d3ab321261ded))
*  add spaces when generating card exports ([6809bbce](https://github.com/LunarTides/Hearthstone.js/commit/6809bbce2f3a7840014e49aeb257d715c24ecfab))
* **script:**  manually exit from the generator ([c95f760c](https://github.com/LunarTides/Hearthstone.js/commit/c95f760c8dcfe703d160bdb9847ffb6b2d872af7))

##### Other Changes

*  remove player.heroPowerCost ([55e810ad](https://github.com/LunarTides/Hearthstone.js/commit/55e810ad2db117ab3a98604e67cb477ba2462b76))
*  rename color.strip to color.stripColors ([bc54af16](https://github.com/LunarTides/Hearthstone.js/commit/bc54af163d0f3533bc60b761d7a8a6c73ebfdbe8))
*  improve example cards ([9de55adc](https://github.com/LunarTides/Hearthstone.js/commit/9de55adcf699b9a0b0e0a2eccbca7f212407e378))
*  remove Card.conditioned ([4e235700](https://github.com/LunarTides/Hearthstone.js/commit/4e23570078cb961e004616120784eca1a273c6a6))
*  update documentation for functions / interact ([4e0a3b10](https://github.com/LunarTides/Hearthstone.js/commit/4e0a3b10e5194d253eb5254832250a20f06a21a0))
*  rename printLicense to license ([5316a011](https://github.com/LunarTides/Hearthstone.js/commit/5316a01172483932588517b40f69c44df24695ab))
*  rename printName to watermark ([0307f014](https://github.com/LunarTides/Hearthstone.js/commit/0307f014c79bc7660fe14f781307b5960d26ab85))
*  rename printAll to showGame ([563a4fd3](https://github.com/LunarTides/Hearthstone.js/commit/563a4fd34a9c4ee9bc7d6a33c1d5cde2fb829e9b))
*  remove capitalizeAll from util functions ([f5b8aab8](https://github.com/LunarTides/Hearthstone.js/commit/f5b8aab8c989ed94a4deadadf2fffefd7945a5e4))
*  remove lastChar util function ([a2f9eeb3](https://github.com/LunarTides/Hearthstone.js/commit/a2f9eeb3c63a8ae91d1b40120b0aa98230085a5b))
*  add date-and-time dependancy ([e5878cc7](https://github.com/LunarTides/Hearthstone.js/commit/e5878cc783cd936716640a37c9f4ac2366a4bb7b))
*  move vanilla card types to another project ([dfc45f4f](https://github.com/LunarTides/Hearthstone.js/commit/dfc45f4fec04df9b3cdbefbb3c26468c4ee754ac))
*  fix all xo warnings ([8b18426e](https://github.com/LunarTides/Hearthstone.js/commit/8b18426e010c529414910af4121c0b5d722bf0ac))
*  force no unused variables in linting ([d82b63e4](https://github.com/LunarTides/Hearthstone.js/commit/d82b63e4246e88089a51a0832c111ffb5ea2e5b8))

##### Refactors

*  remove useless code from getReadable ([a2661508](https://github.com/LunarTides/Hearthstone.js/commit/a2661508194bfda6c82ddc31c4ad8c66da0295b8))
*  add armor and hand size in printPlayerStats ([d1f7f7f2](https://github.com/LunarTides/Hearthstone.js/commit/d1f7f7f2f66e5353dc6c27aa8e2bafe6cc532640))
*  add detail function in printPlayerStats ([253b93c2](https://github.com/LunarTides/Hearthstone.js/commit/253b93c26716953573d5c6c64bf38adde4365d0b))
*  add card.colorFromRarity ([36dd5fc9](https://github.com/LunarTides/Hearthstone.js/commit/36dd5fc9de18c9d90199c7fc5a53dda3fe0cca3d))
*  make stats gray if cannot attack ([a9a9ec50](https://github.com/LunarTides/Hearthstone.js/commit/a9a9ec50322d6a2fdb09e688482e03aced25cffd))
*  add hero power to printPlayerStats ([e4359817](https://github.com/LunarTides/Hearthstone.js/commit/e43598179cc2a8cc17594a90ff66795222115a92))
*  move canAttack to Card class ([606b2033](https://github.com/LunarTides/Hearthstone.js/commit/606b2033c11c0d5a9e3d1dd9d7de35126beb32da))
*  invert condition to remove a tab ([2f1442c2](https://github.com/LunarTides/Hearthstone.js/commit/2f1442c238d96caeb4d76d17349770f4af05d2d3))
*  simplified code in printPlayerStats ([673d1636](https://github.com/LunarTides/Hearthstone.js/commit/673d16363ef939bb22e2f5f3f5d5494d3358a468))
*  remove color.preventParsingTags ([1fe2ef03](https://github.com/LunarTides/Hearthstone.js/commit/1fe2ef03e3e41eba70e76a83853b0e8c3f813be6))
*  add color.stripAll to remove ansi and tags ([bafd2c05](https://github.com/LunarTides/Hearthstone.js/commit/bafd2c05122e99a759e9aa1ab5686f54913346b4))
*  combined blueprint into card types ([3afbff23](https://github.com/LunarTides/Hearthstone.js/commit/3afbff23cd6c5e053f9ca6db28f6f2e8207825a9))
*  add option to prevent parsing color tags ([bbbeca89](https://github.com/LunarTides/Hearthstone.js/commit/bbbeca897e3c4d10e88669547ffd4d1e6326717d))
*  show player weapon in printPlayerStats ([79e02ccd](https://github.com/LunarTides/Hearthstone.js/commit/79e02ccda6932e7ff8fd7ac5f730ee447d6f6b28))
*  rewrote printPlayerStats ([5103abdc](https://github.com/LunarTides/Hearthstone.js/commit/5103abdca31f5bf37a2540ac1d7b13e50262a5f5))
*  rename some parameters to remove underscores ([9a9dc6c5](https://github.com/LunarTides/Hearthstone.js/commit/9a9dc6c50209335eaee3939d75e06b6e847a94fc))
*  remove uuid dependancy ([c59c3199](https://github.com/LunarTides/Hearthstone.js/commit/c59c31992e417ff30cac3937a16bf79e33d1dea6))
*  remove replay mechanic ([b7bbce00](https://github.com/LunarTides/Hearthstone.js/commit/b7bbce0080196e772d2dcf09c1d2ec7e4063a4d3))

#### 2.0.0-beta.4 (2023-10-19)

##### Chores

* **cclib:**  add todos for smarter abilities ([e926e820](https://github.com/LunarTides/Hearthstone.js/commit/e926e8206c916b11568cfb4acbe04502ff10d75d))
*  update types/node dependancy ([95239bda](https://github.com/LunarTides/Hearthstone.js/commit/95239bda67ed76d2be00347a32b688c82a263230))
*  bump build number to 4 ([8eb1c580](https://github.com/LunarTides/Hearthstone.js/commit/8eb1c580a09ceeb4dd9541494bdfe33600a1da83))

##### New Features

* **vcc:**  find hero power text from the vanilla card ([cdb219e3](https://github.com/LunarTides/Hearthstone.js/commit/cdb219e3486823efc3a42a4315551ea15fc7505a))
*  spawn in diy cards mid-game ([0afb0d61](https://github.com/LunarTides/Hearthstone.js/commit/0afb0d610ddf94b3beda58fe855fe0193c5e6f2d))

##### Bug Fixes

*  make set command work with new config system ([6ac7e7d1](https://github.com/LunarTides/Hearthstone.js/commit/6ac7e7d113e7ccfd6d68f7e031e49137be242042))
*  fix showing keywords in cards ([86a19529](https://github.com/LunarTides/Hearthstone.js/commit/86a1952987bbd6fd63083d50181e44fde6bacd2d))
*  fix looking up cards from their ids ([d47f739d](https://github.com/LunarTides/Hearthstone.js/commit/d47f739db493001fc4e2954820df71b2c6f3bc83))
*  prevent cards from causing xo errors ([688b7356](https://github.com/LunarTides/Hearthstone.js/commit/688b735648349ed341181c7b097fe12b5a4d87dd))
*  prevent eval commands in replay files ([cbbe7fe5](https://github.com/LunarTides/Hearthstone.js/commit/cbbe7fe55bb237cc4560a88f3e95fcca6f01e594))
* **dc:**
  *  don't convert to vanilla if fatal error ([4bc838a0](https://github.com/LunarTides/Hearthstone.js/commit/4bc838a028cdf0e45fa28a15377364ec3494f55d))
  *  fix adding / removing cards by ids ([f89ada3c](https://github.com/LunarTides/Hearthstone.js/commit/f89ada3cf8832cc1b90241e18a8a00d518a046f6))
* **id:**  remove redundant tab when changing ids ([1eaa1546](https://github.com/LunarTides/Hearthstone.js/commit/1eaa1546dda0cf4d2bcb97a55613b51d1f1e9d86))
* **vcc:**  add default spell school ([ec2c32d7](https://github.com/LunarTides/Hearthstone.js/commit/ec2c32d7e7c119bb37fd9c16acce9dd45e730c2a))

##### Other Changes

*  update help for the set command ([65011a38](https://github.com/LunarTides/Hearthstone.js/commit/65011a389ad6cd8e5280ffbbd15e546d06371c3e))
*  rename gainOverload to addOverload ([78cc70e6](https://github.com/LunarTides/Hearthstone.js/commit/78cc70e6f5ee01cc05054c3879821506ac412cec))
*  rename gainMana to addMana ([27084fb1](https://github.com/LunarTides/Hearthstone.js/commit/27084fb1721a01b948d4602e3fc32b805a90efa6))
*  rename gainEmptyMana to addEmptyMana ([8783580a](https://github.com/LunarTides/Hearthstone.js/commit/8783580a158c7182c259c00e9dd6e1520983d80a))
*  small error message improvements ([eb392c5e](https://github.com/LunarTides/Hearthstone.js/commit/eb392c5ed41284b1bd67904b245ddec51f55598b))
*  remove evaling flag from the game ([7c5d1e24](https://github.com/LunarTides/Hearthstone.js/commit/7c5d1e2472aeeef6f79420d28d7f002eaa5fc059))
*  combine all fs files into 1 wrapper ([70bb269b](https://github.com/LunarTides/Hearthstone.js/commit/70bb269bcb4fa83daf3a07dd47863da4459aaea4))
*  merge helper files into functions ([c2dbf84a](https://github.com/LunarTides/Hearthstone.js/commit/c2dbf84a7c58d4361c204919667f4b064a3874ad))
*  rewrote chooseOne ([a2671dc9](https://github.com/LunarTides/Hearthstone.js/commit/a2671dc9c00b81dced25a2323f52456d550cd46d))
*  change how chooseOne shows the options ([65084013](https://github.com/LunarTides/Hearthstone.js/commit/65084013a5248ad8c5e2882375f9e51138aef5fd))

##### Refactors

* **dc:**
  *  make help command use walls ([59b87733](https://github.com/LunarTides/Hearthstone.js/commit/59b877339cc65b6639c899d6eba20bca11ae56d2))
  *  small general refactoring ([286668cf](https://github.com/LunarTides/Hearthstone.js/commit/286668cfcef60dfc9edf0141be71938249c21f47))
*  make help command use walls ([61abdec4](https://github.com/LunarTides/Hearthstone.js/commit/61abdec4b64ecf794a948a455f82777fc63a5705))
*  add debugCommandPrefix to config ([bd0de770](https://github.com/LunarTides/Hearthstone.js/commit/bd0de770a85d7626a644d9d9ce669e6bc99e4406))
*  invert condition in history command ([f78e8027](https://github.com/LunarTides/Hearthstone.js/commit/f78e8027eb254411717cca53722eb8cff595bfa1))
*  move infuse code from tick to card class ([ba640c14](https://github.com/LunarTides/Hearthstone.js/commit/ba640c1459ebdf97f41dbf70aca9cdd12b970d89))
*  remove some useless checks ([17dab137](https://github.com/LunarTides/Hearthstone.js/commit/17dab137fd2e9e8f43419bc1a93fb2c5561b0296))
*  add useUnknownInCatchVariables ([1dfd7b8e](https://github.com/LunarTides/Hearthstone.js/commit/1dfd7b8e4e0fdc8ee1bf2b235583d1885b4e14bf))
*  change param in galakrondFormula to number ([8ba2c128](https://github.com/LunarTides/Hearthstone.js/commit/8ba2c1281bd2bc5f3fe453958a2f9a03062f268c))
*  use process.exit instead of errors ([cb66bdf6](https://github.com/LunarTides/Hearthstone.js/commit/cb66bdf619ea79a4adb5ded5c522cb387bb92872))
*  move galakrondBump to the card class ([9ba00076](https://github.com/LunarTides/Hearthstone.js/commit/9ba0007649cc060d9f12b58a2bb1447d6e7f9c17))
*  consolidated code from previous commits ([b94a6af8](https://github.com/LunarTides/Hearthstone.js/commit/b94a6af8355fd212edee1c76429f3a3e85c59886))
*  add caching to reading files ([823bd62b](https://github.com/LunarTides/Hearthstone.js/commit/823bd62b8b27ac1c1e318332ca65ddc53ffc004d))
*  combine fs imports into one variable ([1315aeba](https://github.com/LunarTides/Hearthstone.js/commit/1315aeba9547cb38b99c618e1207797d87d5a37c))
*  add vanilla card type file ([19e3d9c0](https://github.com/LunarTides/Hearthstone.js/commit/19e3d9c0e8656ff8c3a2013975872270331ee0d4))
*  add a commands interact file ([8f5188ce](https://github.com/LunarTides/Hearthstone.js/commit/8f5188cef7cf61bcf9ee865f62a19962311d458b))
*  clone cards before adding it to history ([8af4e3ca](https://github.com/LunarTides/Hearthstone.js/commit/8af4e3ca869c52ef9cea77ae3be76f1075c710fb))
*  add newline after error in fromVanilla ([d18c6800](https://github.com/LunarTides/Hearthstone.js/commit/d18c680043da1714334d20311040d7a5685585a2))
*  show commit hash in name if in debug mode ([1f1fd6a9](https://github.com/LunarTides/Hearthstone.js/commit/1f1fd6a9f3d32e36f360ce144598c2ffad1014a9))
*  change all Number.parseInt to lodash.parseInt ([345937eb](https://github.com/LunarTides/Hearthstone.js/commit/345937eb8b310075f958cc7886321c92ab474095))
*  add short version of italic in fromTags ([3e24f3f5](https://github.com/LunarTides/Hearthstone.js/commit/3e24f3f51448e4119c53e4a57d7f0163b5f83ac3))
*  add dark prefix to fromTags ([7bbbcc4b](https://github.com/LunarTides/Hearthstone.js/commit/7bbbcc4b0ca7d942ab7e47709b0e25e0962cf56a))
*  temporarily disable complexity checking ([d5907ac5](https://github.com/LunarTides/Hearthstone.js/commit/d5907ac5e70b5312bb9bdcc8c7fe4d97953296fd))
*  prevent passives from causing xo errors ([5092f063](https://github.com/LunarTides/Hearthstone.js/commit/5092f063cb3672f272f1fa29f52936f6757bc110))
*  change placeholders behind-the-scenes ([26735d90](https://github.com/LunarTides/Hearthstone.js/commit/26735d90062df3439e0b0571975bf59be13b256d))
*  use traditional turn counter function ([1df672f1](https://github.com/LunarTides/Hearthstone.js/commit/1df672f17887457c2590561b137dc7b11b709a82))
*  use assert.equal instead of just assert ([682c0b31](https://github.com/LunarTides/Hearthstone.js/commit/682c0b3168fb3f554ec30b8cf8afdb7323641cce))
*  change back to 4 spaces instead of tabs ([a17a68db](https://github.com/LunarTides/Hearthstone.js/commit/a17a68db97c1d840f9f7a20832302236aa91e432))
*  began adding compatibility with xo ([2e0f1278](https://github.com/LunarTides/Hearthstone.js/commit/2e0f12780da976a812dd55d158861a295fa99d1c))
*  remove axios dependancy ([a5ec4c80](https://github.com/LunarTides/Hearthstone.js/commit/a5ec4c8015274d0b9cda4eb9c7cff247a25ed604))
* **cclib:**  only add tests to cards that have an ability ([199d7e78](https://github.com/LunarTides/Hearthstone.js/commit/199d7e78421c69895bf6e8cf83f6064dd4717128))

#### 2.0.0-beta.3 (2023-10-12)

##### Chores

*  add example to show another ability format ([f6476427](https://github.com/LunarTides/Hearthstone.js/commit/f6476427cfe040e2a266a01e8a0cc29e522c3151))
*  add issue number to todos ([f08e0fe9](https://github.com/LunarTides/Hearthstone.js/commit/f08e0fe91dfec2d252624950b5808220cb313293))
*  update dependancies ([75b8f82e](https://github.com/LunarTides/Hearthstone.js/commit/75b8f82ec2531c62aac4cbb7bfc285f94687ad9c))
*  add test todos to more stage 2 cards ([cc58d769](https://github.com/LunarTides/Hearthstone.js/commit/cc58d769ff5629dd5c233ad2742940fa71a9e49c))
*  update loc count in loc.sh ([ae2b8cd1](https://github.com/LunarTides/Hearthstone.js/commit/ae2b8cd13d435f0152ee5a55f67fcf7994d5e03f))
*  bump version to 2.0.0-beta.3 ([9f30772f](https://github.com/LunarTides/Hearthstone.js/commit/9f30772f75f4c42fd37e9cc1512dde48fed4fee3))

##### New Features

*  make maximum hand length customizable ([f941a4d5](https://github.com/LunarTides/Hearthstone.js/commit/f941a4d57fc275330d8f0f8f7ada7a4bf5263adc))
*  add forge keyword ([9db981b7](https://github.com/LunarTides/Hearthstone.js/commit/9db981b7ea7143fe672b6786775a6855d767f326))
*  add ability to prevent event suppression ([809dc3ce](https://github.com/LunarTides/Hearthstone.js/commit/809dc3ceabdd36ffe0095f48de296b1d31f42aaf))
*  add ability to replay previous games ([abda1963](https://github.com/LunarTides/Hearthstone.js/commit/abda19639f69a88221ef4f7a2e08d0564baff99b))
*  add stripAnsi to the color functions ([44a936f1](https://github.com/LunarTides/Hearthstone.js/commit/44a936f1ecd638eed4e5ae1cdc7b998d8e8ca924))
* **dc:**  add config to show uncollectible cards ([5202190c](https://github.com/LunarTides/Hearthstone.js/commit/5202190c9958976ecb68388db4765a328f23eef0))

##### Bug Fixes

*  add forging to history and fixes to trading ([16ecf54d](https://github.com/LunarTides/Hearthstone.js/commit/16ecf54d47d2cc8a9055e77b2c63e9b7f9cd22f8))
*  fix game not launching editor on windows ([6b86d11c](https://github.com/LunarTides/Hearthstone.js/commit/6b86d11c6e7ba91b95ec335c078a53dbcb79876c))
*  fix location cards being displayed as minions ([51963cbf](https://github.com/LunarTides/Hearthstone.js/commit/51963cbfabf936d43b24efb73848005a6be8e8cd))
* **game:**  run killMinions directly in attack ([ffcd7cea](https://github.com/LunarTides/Hearthstone.js/commit/ffcd7cea3da22cd8b9a409bf73d316c8ba6cb58d))
* **cclib:**  fix finding abilities from text ([b4d7401c](https://github.com/LunarTides/Hearthstone.js/commit/b4d7401c0450e105f1fcae28fa44115fa9505c96))
* **dc:**  parse cmd as card before assuming times ([4689a6e9](https://github.com/LunarTides/Hearthstone.js/commit/4689a6e9373280acdb28ca4e9a03d0ee24f22406))

##### Other Changes

*  make vanilla.getAll return [] | Error ([f4272c13](https://github.com/LunarTides/Hearthstone.js/commit/f4272c139488983d93c6e858dbfee5bf37d255c6))
*  remove player from take damage event ([8b2e4935](https://github.com/LunarTides/Hearthstone.js/commit/8b2e4935c0ad10f2507a6dc1d2bf1e24fa5afc78))
*  made a lot of card variables keywords ([188ea0dd](https://github.com/LunarTides/Hearthstone.js/commit/188ea0dd0aacc6a0e5d80c4964726db27e9e0601))
*  move cardupdater to vanilla category ([753c0c75](https://github.com/LunarTides/Hearthstone.js/commit/753c0c7574449d1f040006d08a9bce4ec7690abd))
*  remove keyword and error function files ([bd4cbd63](https://github.com/LunarTides/Hearthstone.js/commit/bd4cbd6344967bf96e9d15309dfa73f1184471f5))
*  remove activateBattlecry ([1475e178](https://github.com/LunarTides/Hearthstone.js/commit/1475e178b6d1bc41d9c4dcc75f6801757bb06b15))
*  use log files instead of replay files ([3bff3262](https://github.com/LunarTides/Hearthstone.js/commit/3bff3262627aa52b58ee938422d45084c8e59b80))
*  change game.cards to game.blueprints ([9e413084](https://github.com/LunarTides/Hearthstone.js/commit/9e413084decf9e253580c1316398cbcd51b3fd15))
*  make handleCmds take in an object for flags ([9fbaca3d](https://github.com/LunarTides/Hearthstone.js/commit/9fbaca3d81d0e28a1249b2c8c77f843d777c0d50))
*  split interact into multiple files ([8835d6fc](https://github.com/LunarTides/Hearthstone.js/commit/8835d6fce61f827ac1ec27998b80f6c29362be94))
*  move some card related functions to card class ([bbabead4](https://github.com/LunarTides/Hearthstone.js/commit/bbabead44648015ac1b5eafc8564d0b64109bd09))
*  remove player functions module ([3d47f754](https://github.com/LunarTides/Hearthstone.js/commit/3d47f75456200dd85331d963f43f0eb3f668f8ca))
*  refactor functions into multiple files ([3e3fe4a6](https://github.com/LunarTides/Hearthstone.js/commit/3e3fe4a67dbd9a2fb25c34484f09b6d7325f57ce))
* **dc:**  add comments explaining colored names ([8a73a7f6](https://github.com/LunarTides/Hearthstone.js/commit/8a73a7f6a3d109ec1a1a4d0c611539b806b6e360))

##### Performance Improvements

*  return early in applyEnchantments if list is empty ([f75f6823](https://github.com/LunarTides/Hearthstone.js/commit/f75f682340f3a112c3aa21f040517cf60216196f))

##### Refactors

*  allow "./" and fix a bug with restrictPath ([eace3d3b](https://github.com/LunarTides/Hearthstone.js/commit/eace3d3b8461e871655a27cf73b7b9feee156377))
*  split types into multiple files ([455d074c](https://github.com/LunarTides/Hearthstone.js/commit/455d074ca915f45a3c48e9058a0824f6305f65c4))
*  reformat types file ([95e717bc](https://github.com/LunarTides/Hearthstone.js/commit/95e717bc75f9e22b4b6d3787e7871f76eeccbc12))
*  add game.pause to pause the game ([4b898f8d](https://github.com/LunarTides/Hearthstone.js/commit/4b898f8de1e817144b81dcae2cd1c21788614f37))
*  move input, log from game to gameLoop ([e2474fa0](https://github.com/LunarTides/Hearthstone.js/commit/e2474fa06553272470af770197c583ff8384d31a))
*  remove replacePlaceholders from tick ([357723bf](https://github.com/LunarTides/Hearthstone.js/commit/357723bf76bdc9c6f013acfea219bb613af938b3))
*  make replay throw error instead of false ([b03a0273](https://github.com/LunarTides/Hearthstone.js/commit/b03a027312565c1f23d83bd1e9c3eed99727ea4c))
*  remove `historyCardOnlyName` from handleCmds ([a8e265a0](https://github.com/LunarTides/Hearthstone.js/commit/a8e265a0f239acc37bb19883540167b7ee33de49))
*  add getting date into its own function ([32ac6374](https://github.com/LunarTides/Hearthstone.js/commit/32ac6374232611fb2d79e443af66c9070f298c56))
*  add history type to the types.ts file ([80f2db86](https://github.com/LunarTides/Hearthstone.js/commit/80f2db8670f5a114894d430cdc9d314f87d5e6f3))
*  add `eventPlayer` to passive ability ([fa92254d](https://github.com/LunarTides/Hearthstone.js/commit/fa92254ded17b0ca40e1415a4a498ec7633f9233))
* **dc:**
  *  add less hardcoded defaults ([f2502439](https://github.com/LunarTides/Hearthstone.js/commit/f250243955db027d718bf570e8130bda654e4269))
  *  reformat warning state logging ([9707c4f8](https://github.com/LunarTides/Hearthstone.js/commit/9707c4f8c1a059b4f546ee4ab68f193ef78fab8b))
* **id:**  warn user about holes / dupes on start ([4caf07ac](https://github.com/LunarTides/Hearthstone.js/commit/4caf07acc9c10d7788bef3012f184489d0b4deff))
* **ai:**  make _tauntExists always return Card[] ([8c42da21](https://github.com/LunarTides/Hearthstone.js/commit/8c42da2145809c8b1934b26c7dc803322adbab3a))
* **cclib:**  only add create if text is truthy ([b2225f38](https://github.com/LunarTides/Hearthstone.js/commit/b2225f38abb655efd1f45d4d42f7fb1032c980d5))
* **ccc:**  removed exit checks and added defaults ([6f5297ee](https://github.com/LunarTides/Hearthstone.js/commit/6f5297ee6015722221330562f16b763582ca92be))

##### Tests

*  began adding test cards ([08c61696](https://github.com/LunarTides/Hearthstone.js/commit/08c61696b668a0caf128ad0043dac58081ffbd5a))

## v2.0.0-beta.2 (2023-10-03)

### Feat

- add back galakrond cards
- **cclib**: add blueprint validation. try to compile
- add traditional turn counter function
- **cclib**: generate card exports on create
- add watch in makefile

### Fix

- **uc**: actually replace regex. replace all game params
- **ccc**: use correct tribe instead of using _card

### Refactor

- split idscript. use idscript in src index
- **uc**: generate exports on completion
- add common function for fs functions
- use const instead of let
- rename galakrond cards to their class
- rename dry-run short command to '-n'
- hide player attack stat if no attack
- move trying to compile to `tryCompile`
- remove optional fields from blueprints
- **uc**: remove game parameter on upgrade
- remove all `game = globalThis.game`
- remove `game` parameter from ability
- put event manager into its own file
- **cclib**: make overridePath implicitly use dirname

## v2.0.0-beta.1 (2023-09-26)

### BREAKING CHANGE

- Removed the `triggerDeathrattle` parameter from `destroyWeapon`
- Renamed `addDeathrattle` to `addAbility`
- Renamed `maxMaxMana` to `maxMana`
- Renamed `maxMana` to `emptyMana`.

### Feat

- find vanilla card types in the propfinder
- add lodash and remove redundant functions
- add caching to getLatestCommit
- add wrapper functions for fs operations
- add tests to most of the cards. add assert
- add testcards script to unit test cards
- **game**: add test ability to cards
- **game**: add flag to temp disable output
- add support for both spellings of gray tags.
- add cli to do the runner's job through cmds
- automatically update .mts extensions to .ts
- **script**: add checking latest id in idscript
- **script**: check mismatched types in propfinder
- added a vanilla card property finder
- added commit hash to version command
- added function to get the version of the game
- added function to get latest commit hash
- added build number to config file
- added alpha branch option to config file
- Added commit hash and uname to log file
- Added `runCommand` function to run shell commands

### Fix

- **vcc**: swap durability and health for wpn / loc
- update the desc field in upgradecards
- ignore exports.ts file when reading cards folder
- fix some todos and move / refactor others
- **game**: fix bug with runCommandAsChildProcess
- **game**: check if game exists before respecting no_output
- add player to event value for takedamage
- fix a cc library bug that always crashes it
- **game**: fix openWithArgs to work with runCommand
- make upgradeCards delete the dist folder
- updated slice amount for ts files from 4 to 3
- made some vanilla card properties optional
- fix type docstring to not give an error
- **script**: added placeholders in check warning
- updated genvanilla scripts to run correct script
- **vcc**: removed unused ts-expect-error
- changed parameter to any type in `print_todo`
- More reliable way of getting os name on linux
- Shortened commit hash in log files
- Removed more child_process imports
- Added build info to version in package file
- Added console.clear to cls function

### Refactor

- add helper function to upgrade cards
- remove all deprecated functions
- sort card exports alphabetically
- **game**: rename desc to text in cards
- rename all snake case variables
- **game**: remove functions.validateClass
- **game**: make summonMinion not return card
- **dc**: use shouldExit instead of only "exit"
- **game**: make last return undefined
- change dirname to not include dist
- change name in exports to use hash of path
- replace all </> with proper closing tags
- use args.shift to get name instead
- refactor openWithArgs to only 1 arg
- add common helper function to runner
- update cc's to take debug and type args
- remove old code comment
- make runCommand possibly return error
- use optional chaining in cards
- change export to use name instead of hash
- change card extension from .mts to .ts
- changed how cards are registered
- made randList possibly return null
- move dc and cc to a new tools folder
- remove all ts-expect-error's
- change config file to a typescript file
- move searching cards folder to functions
- move inline comments above the code
- make getReadableCard a bit more readable
- remove useless imports in runner file
- **game**: change type-specific code playcard
- **ccc**: change running type-specific code
- changed where vanilla cards are stored
- remove card creator folders
- **cclib**: make getCardAbility more readable
- **cclib**: change parameter to use camelcase
- moved vc generator to scripts folder
- made getVersion start at 1 instead of 0
- renamed dev to beta in config file
- **game**: removed parameter from destroyWeapon
- **game**: renamed addDeathrattle
- **cclib**: refactored getCardAbility
- **cclib**: renamed function to ability
- Refactored dormant a bit

## v2.0.0-beta.0 (2023-09-19)

## v1.6.2 (2023-08-28)

## v1.6.1 (2023-08-21)

## v1.6.0 (2023-08-05)

## v1.5.1 (2023-06-09)

## v1.5.0 (2023-06-09)

## v1.4.0 (2023-05-14)

## v1.3.0 (2023-05-14)

## v1.2.0 (2023-05-14)

## v0.1.0 (2023-05-15)
