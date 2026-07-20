import { FileCode2, FolderTree } from "lucide-react";
import type { FileNode } from "@/lib/constants";
import { workspaceFiles } from "@/lib/constants";

function TreeNode({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  return (
    <div>
      <div className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm text-foreground/70 hover:bg-foreground/5" style={{ paddingLeft: `${depth * 14 + 8}px` }}>
        {node.type === "folder" ? <FolderTree className="h-4 w-4 text-primary" /> : <FileCode2 className="h-4 w-4 text-success" />}
        <span>{node.name}</span>
      </div>
      {node.children?.map((child) => (
        <TreeNode key={`${node.name}-${child.name}`} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export function FileTree() {
  return (
    <div className="space-y-2 rounded-3xl border border-border/80 bg-card/45 p-4">
      {workspaceFiles.map((node) => (
        <TreeNode key={node.name} node={node} />
      ))}
    </div>
  );
}
