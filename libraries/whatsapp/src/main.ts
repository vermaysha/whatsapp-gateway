import { Whatapp } from "./whatsapp";
import { readdirSync, statSync } from 'fs'
import { join } from 'path'
import { logger as parentLogger } from "./whatsapp/whatsapp.logger";

/**
 * Recursively retrieves all files in a given directory.
 *
 * @param {string} dir - The directory to search for files.
 * @param {string[]} files_ - An optional array to store the file names.
 * @return {string[]} - An array containing the names of all files in the directory.
 */
function getFiles(dir: string, files_: string[] = []): string[] {
  dir = join(__dirname, dir)
  const files = readdirSync(dir);
  for (const i in files){
      const name = join(dir, files[i]);
      if (statSync(name).isDirectory()){
          getFiles(name, files_);
      } else {
          files_.push(name);
      }
  }
  return files_;
}

;(async () => {
  const wa = new Whatapp();
  const logger = parentLogger.child({ module: 'Main Worker' });

  if (!process.send) {
    console.log("Node is not running in a worker process");
    process.exit(0);
  }

  const files = getFiles('./commands')
  const commands: Map<string, any> = new Map();
  for (const file of files) {
    try {
      const command = (await import(file)).default(wa, logger);

      commands.set(command.name, command.handler);
    } catch (error) {
      console.warn('Could not load command', file, error);
    }
  }

  process.on('message', async (msg: any) => {
    if (commands.has(msg.command)) {
      await commands.get(msg.command)(msg.data ?? undefined);
    }
  });
})()
