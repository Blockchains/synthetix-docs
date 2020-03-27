'use strict';

const path = require('path');
const fs = require('fs');
const axios = require('axios');
const parser = require('solidity-parser-antlr');

const snx = require('synthetix');

const network = 'mainnet';
const sources = snx.getSource({ network });

const { version } = require('./utils');

const getPathFromSource = ({ source }) => path.join(__dirname, '..', 'content', 'contracts', `${source}.md`);
const doesContractExist = ({ source }) => fs.existsSync(getPathFromSource({ source }));

(async () => {
	for (const [source] of Object.entries(sources)) {
		if (doesContractExist({ source })) {
			// continue;
		}

		const currentVersion = 'v' + version();

		const { data: soliditySource } = await axios.get(
			`https://raw.githubusercontent.com/Synthetixio/synthetix/${currentVersion}/contracts/${source}.sol`,
		);

		try {
			fs.writeFileSync(
				path.join(__dirname, source + '.json'),
				JSON.stringify(parser.parse(soliditySource), null, '\t'),
			);
			// TODO
		} catch (e) {
			if (e instanceof parser.ParserError) {
				console.log(e.errors);
			}
		}

		const content = `
# ${source}

**Source:** [${source}.sol](https://github.com/Synthetixio/synthetix/blob/${currentVersion}/contracts/${source}.sol)

!!! todo "Work in Progress"

    This needs filling in

## Description

... todo.

---

## Architecture

... todo.

<!--centered-image>
    ![Architecture Graph](../img/graphs/todo-architecture.svg)
</centered-image-->


### Inheritance Graph

<!--centered-image>
    ![Inheritance graph](../img/graphs/todo.svg)
</centered-image-->

### Related Contracts

- ?

---

## Constants

---

## Variables

.. (need to pull these from the functions below)

---

## Views

---

## Public Mutative Functions

---

## Owner Mutative Functions

---

## Internal & Restricted Mutative Functions

---

## Modifiers

---

## Events

--

`;

		fs.writeFileSync(getPathFromSource({ source }), content);
	}
})();
