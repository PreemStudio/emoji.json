// Modified Version of https://github.com/muan/unicode-emoji-json

import fs from 'node:fs';

const UNICODE_VERSION = '15.0';

fs.writeFileSync(
	'source/emoji-test.txt',
	await (await fetch(`https://unicode.org/Public/emoji/${UNICODE_VERSION}/emoji-test.txt`)).text(),
);

fs.writeFileSync(
	'source/emoji-ordering.txt',
	await (await fetch(`https://unicode.org/emoji/charts-${UNICODE_VERSION}/emoji-ordering.txt`)).text(),
);
