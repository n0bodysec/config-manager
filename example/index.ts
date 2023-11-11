import { ConfigManager } from '@n0bodysec/config-manager';

type TConfig = {
	name: string;
	surname: string;
	age?: number;
};

const defaultData = {
	name: 'This is a default name',
	surname: 'This is a default surname',
	// age: 12, // age is optional
} satisfies TConfig;

(async () =>
{
	const cfgManager = new ConfigManager(defaultData);
	await cfgManager.Initialize('config.json');

	console.log(cfgManager.data);
})();
