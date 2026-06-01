import { randomUUID, createHash } from 'node:crypto';
import { mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { parse, stringify } from 'yaml';
import type { ZodType } from 'zod';

export type FileVersion = {
	mtimeMs: number;
	sha256: string;
};

export type VersionedYaml<T> = {
	data: T;
	version: FileVersion;
};

export class YamlRepositoryError extends Error {
	constructor(
		message: string,
		readonly cause?: unknown
	) {
		super(message);
		this.name = 'YamlRepositoryError';
	}
}

export async function readVersionedYaml<T>(
	filePath: string,
	schema: ZodType<T>
): Promise<VersionedYaml<T>> {
	const content = await readFile(filePath, 'utf8');
	let parsed: unknown;

	try {
		parsed = parse(content);
	} catch (error) {
		throw new YamlRepositoryError(`Invalid YAML data in ${filePath}`, error);
	}

	const result = schema.safeParse(parsed);

	if (!result.success) {
		throw new YamlRepositoryError(`Invalid YAML data in ${filePath}`, result.error);
	}

	return {
		data: result.data,
		version: await getFileVersion(filePath, content)
	};
}

export async function writeYamlAtomic<T>(
	filePath: string,
	data: T,
	schema: ZodType<T>
): Promise<FileVersion> {
	const result = schema.safeParse(data);

	if (!result.success) {
		throw new YamlRepositoryError(
			`Refusing to write invalid YAML data to ${filePath}`,
			result.error
		);
	}

	const content = stringify(result.data, { lineWidth: 0 });
	await mkdir(dirname(filePath), { recursive: true });

	const temporaryPath = join(dirname(filePath), `.${randomUUID()}.tmp`);
	await writeFile(temporaryPath, content, { encoding: 'utf8', flag: 'wx' });
	await rename(temporaryPath, filePath);

	return getFileVersion(filePath, content);
}

export async function getFileVersion(filePath: string, content?: string): Promise<FileVersion> {
	const [fileStat, fileContent] = await Promise.all([
		stat(filePath),
		content === undefined ? readFile(filePath, 'utf8') : Promise.resolve(content)
	]);

	return {
		mtimeMs: fileStat.mtimeMs,
		sha256: createHash('sha256').update(fileContent).digest('hex')
	};
}
