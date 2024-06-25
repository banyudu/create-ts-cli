import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface Options {
}

function usage () {
  console.log(`Usage: ${process.argv[1]} [options] <project-name>

  Options:
    -h, --help    Show this help message and exit
`)
}

const blacklist = [
  'node_modules',
  'dist',
  '.git'
]

export default async function main(options: Options) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const projName = (options as any)._?.[0]
  if (!projName) {
    usage()
    process.exit(1)
  }

  console.log(`Creating project ${projName}...`)
  if (fs.existsSync(projName)) {
    console.error(`Error: Directory ${projName} already exists`)
    process.exit(1)
  }

  fs.mkdirSync(projName)
  const targetPath = path.resolve(projName)
  const rootDir = path.join(__dirname, '..')

  const files = fs.readdirSync(rootDir)

  const targetPathIsInsideSourcePath = targetPath.startsWith(rootDir)

  for (const file of files) {
    if (blacklist.includes(file)) {
      continue
    }

    if (targetPathIsInsideSourcePath && file === projName) {
      continue
    }

    fs.cpSync(path.join(__dirname, '..', file), path.join(projName, file), { recursive: true })
  }
}
