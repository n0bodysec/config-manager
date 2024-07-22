import merge from 'lodash.merge';
import { readFile } from 'node:fs/promises';

type TAnyKey = Record<string, unknown>;

export class ConfigManager<TConfig extends TAnyKey>
{
	constructor(defaultData: TConfig)
	{
		this.defaultData = defaultData;
		this.data = defaultData;
	}

	data: TConfig;

	defaultData: TConfig;

	initialized = false;

	Initialize = async (path: string) =>
	{
		await this.load(path);
		this.sanitize();
		this.initialized = true;
	};

	load = async (path: string) =>
	{
		const file = await readFile(path, 'utf-8');
		const parsedJson = JSON.parse(file) as TConfig;

		if (typeof parsedJson !== 'object') throw new Error('Invalid data provided');

		this.data = parsedJson;
	};

	sanitize = () =>
	{
		// sanitize the typeof data loaded from config
		this.#sanitizeType(this.defaultData, this.data);

		// merge data not found in the loaded config
		this.data = merge(this.defaultData, this.data);
	};

	#sanitizeType = (src: Record<string, unknown>, dst: Record<string, unknown>) =>
	{
		Object.keys(dst).filter((key) => key in src).forEach((key) =>
		{
			const type1 = typeof (dst as TAnyKey)[key];
			const type2 = typeof (src as TAnyKey)[key];

			// check if we can actually read a default data to compare against
			if (type2 !== 'undefined')
			{
				if (type1 === 'object' && src[key] != null) this.#sanitizeType(src[key] as Record<string, unknown>, dst[key] as Record<string, unknown>);
				if (type1 !== type2) (dst as TAnyKey)[key] = (src as TAnyKey)[key];
			}
		});
	};
}
