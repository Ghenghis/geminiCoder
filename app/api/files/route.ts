
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

async function getFileStructure(dir: string): Promise<any[]> {
  const items = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    items.map(async (item) => {
      const filePath = path.join(dir, item.name);
      if (item.isDirectory()) {
        const children = await getFileStructure(filePath);
        return {
          name: item.name,
          type: 'directory',
          path: filePath,
          children,
        };
      }
      return {
        name: item.name,
        type: 'file',
        path: filePath,
      };
    })
  );
  return files;
}

export async function GET() {
  try {
    const projectRoot = process.cwd();
    const files = await getFileStructure(projectRoot);
    return NextResponse.json({ files });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}
