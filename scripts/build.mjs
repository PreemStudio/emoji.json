// Modified Version of https://github.com/muan/unicode-emoji-json

import slugify from '@sindresorhus/slugify';
import fs from 'node:fs';

function toSlug(str) {
	let normalized = str.normalize('NFD');

	for (
		const [key, value] of Object.entries({
			'*': 'asterisk',
			'&': 'and',
			'#': 'hashtag',
			'1st': 'first',
			'2nd': 'second',
			'3rd': 'third',
		})
	) {
		normalized = normalized.replace(key, value);
	}

	return slugify(normalized)
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/\(.+\)/g, '')
		.trim()
		.replace(/[\W|_]+/g, '_').toLowerCase();
}

const UNICODE_VERSION = '15.0';

const dataByEmoji = [];
const emojiComponents = {};

// GROUP
const GROUP_REGEX = /^#\sgroup:\s(?<name>.+)/;
const EMOJI_REGEX =
	/^(?<unicodeCodePoints>[^#]+);\s(?<type>[\w-]+)\s+#\s(?<emoji>\S+)\sE(?<unicodeVersion>\d+\.\d)\s(?<description>.+)/;

let currentGroup = null;

fs.readFileSync('source/emoji-test.txt').toString().split('\n').forEach(line => {
	const groupMatch = line.match(GROUP_REGEX);

	if (groupMatch) {
		currentGroup = groupMatch.groups.name;
	} else {
		const emojiMatch = line.match(EMOJI_REGEX);

		if (emojiMatch) {
			const {
				description,
				emoji,
				type,
				unicodeCodePoints,
				unicodeVersion,
			} = emojiMatch.groups;

			if (type === 'fully-qualified') {
				const data = {
					emoji,
					group: currentGroup,
					name: description,
					description,
					identifier: toSlug(description),
					unicode: {
						code_points: unicodeCodePoints.trim(),
						version: unicodeVersion,
					},
				};

				if (description.includes(': ')) {
					const [newName, newDescription] = description.split(': ');

					data.name = newName;
					data.description = newDescription;
				}

				dataByEmoji.push(data);
			}
		}
	}
});

fs.writeFileSync('distribution/emojis.json', JSON.stringify(dataByEmoji));
