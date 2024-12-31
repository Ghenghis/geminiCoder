
import { NextResponse } from 'next/server';
import JSZip from 'jszip';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  const zip = new JSZip();

  async function addFilesToZip(dir: string, zipFolder: JSZip) {
    const files = await fs.readdir(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = await fs.stat(filePath);
      
      if (stat.isDirectory()) {
        await addFilesToZip(filePath, zipFolder.folder(file)!);
      } else {
        const content = await fs.readFile(filePath);
        zipFolder.file(file, content);
      }
    }
  }

  try {
    await addFilesToZip(process.cwd(), zip);
    const content = await zip.generateAsync({ type: "nodebuffer" });
    
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename=project.zip'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create ZIP' }, { status: 500 });
  }
}
