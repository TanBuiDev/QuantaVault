import { parse } from "yaml";

export interface TestCaseItem {
  name: string;
  source?: string;
  input?: Record<string, any>;
  expected?: any;
  expected_mutation?: Record<string, any>;
  operations?: string[];
  arguments?: any[][];
}

export interface LanguageContractParameter {
  name: string;
  type: string;
}

export interface LanguageContract {
  class: string;
  method?: string;
  parameters?: LanguageContractParameter[];
  return_type?: string;
}

export interface CasesData {
  schema_version: number;
  problem_id: number;
  contract_type: "method" | "operation-sequence" | "custom";
  language_contract?: LanguageContract;
  cases: TestCaseItem[];
}

export function parseCasesYaml(casesYaml: string | null | undefined): CasesData | null {
  if (!casesYaml || typeof casesYaml !== "string" || !casesYaml.trim()) {
    return null;
  }

  try {
    const parsed = parse(casesYaml);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    return parsed as CasesData;
  } catch (err) {
    console.error("Failed to parse cases.yaml:", err);
    return null;
  }
}

const LIST_NODE_COMMENT = `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
`;

const TREE_NODE_COMMENT = `/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
`;

/**
 * Parses a full Java solution file and extracts only the class & public method signatures
 * with empty bodies, matching LeetCode's official starter templates.
 */
function extractEmptyTemplateFromJava(fullSource: string): string | null {
  try {
    // 1. Find class declaration: class ClassName ... {
    const classMatch = fullSource.match(/(?:public\s+)?class\s+([A-Za-z0-9_]+)[^{]*\{/);
    if (!classMatch || classMatch.index === undefined) {
      return null;
    }

    const className = classMatch[1];
    const classStartIndex = classMatch.index + classMatch[0].length;

    // 2. Scan class body for public methods / constructors
    const classBody = fullSource.slice(classStartIndex);
    const publicMethods: { signature: string; name: string; returnType: string; params: string }[] = [];

    // Regex for public methods / constructors: public [ReturnType] Name(Params) [throws ...] {
    const methodRegex = /public\s+(?:(?:static|final)\s+)?(?:([\w\[\]<>, ?]+)\s+)?([A-Za-z0-9_]+)\s*\(([^)]*)\)[^{]*\{/g;
    let m;

    while ((m = methodRegex.exec(classBody)) !== null) {
      const returnType = m[1] ? m[1].trim() : ""; // empty for constructor
      const name = m[2].trim();
      const params = m[3].trim();

      // Don't include helper classes or main methods
      if (name === "main") continue;

      const signature = returnType ? `public ${returnType} ${name}(${params})` : `public ${name}(${params})`;

      publicMethods.push({ signature, name, returnType, params });
    }

    if (publicMethods.length === 0) {
      return null;
    }

    // 3. Build template
    let template = `class ${className} {\n`;

    if (publicMethods.length === 1) {
      // Single method (e.g. class Solution { public int[] productExceptSelf(...) { \n \n } })
      template += `    ${publicMethods[0].signature} {\n        \n    }\n}`;
    } else {
      // Multiple methods (e.g. class RandomizedSet { ... })
      const methodsFormatted = publicMethods
        .map((pm) => `    ${pm.signature} {\n        \n    }`)
        .join("\n\n");
      template += `${methodsFormatted}\n}`;

      // Append usage comment for operation sequence classes
      if (className !== "Solution") {
        let usageComment = `\n\n/**\n * Your ${className} object will be instantiated and called as such:\n * ${className} obj = new ${className}();\n`;
        let paramIdx = 1;
        for (const pm of publicMethods) {
          if (pm.name === className) continue; // skip constructor
          const callArg = pm.params.trim() ? pm.params.split(",")[0].trim().split(" ").pop() || "val" : "";
          if (pm.returnType && pm.returnType !== "void") {
            usageComment += ` * ${pm.returnType} param_${paramIdx} = obj.${pm.name}(${callArg});\n`;
            paramIdx++;
          } else {
            usageComment += ` * obj.${pm.name}(${callArg});\n`;
          }
        }
        usageComment += ` */`;
        template += usageComment;
      }
    }

    return template;
  } catch (err) {
    console.error("Error extracting empty template from Java source:", err);
    return null;
  }
}

export function generateStarterCode(casesData: CasesData | null, fullSource?: string | null): string {
  let docComment = "";

  // Check if ListNode / TreeNode definitions are needed
  const combinedText = `${fullSource || ""} ${casesData?.language_contract?.return_type || ""} ${JSON.stringify(casesData?.language_contract?.parameters || [])}`;
  if (combinedText.includes("ListNode")) {
    docComment += LIST_NODE_COMMENT;
  } else if (combinedText.includes("TreeNode")) {
    docComment += TREE_NODE_COMMENT;
  }

  // 1. Try extracting exact signatures from full Java solution
  if (fullSource && fullSource.trim()) {
    const extracted = extractEmptyTemplateFromJava(fullSource);
    if (extracted) {
      return `${docComment}${extracted}\n`;
    }
  }

  // 2. Fallback to building from casesData language_contract
  if (casesData?.language_contract) {
    const contract = casesData.language_contract;

    if (casesData.contract_type === "method" && contract.method) {
      const params = (contract.parameters || []).map((p) => `${p.type} ${p.name}`).join(", ");
      const returnType = contract.return_type || "void";
      return `${docComment}class ${contract.class || "Solution"} {\n    public ${returnType} ${contract.method}(${params}) {\n        \n    }\n}\n`;
    }

    if (casesData.contract_type === "operation-sequence" && contract.class) {
      return `${docComment}class ${contract.class} {\n\n    public ${contract.class}() {\n        \n    }\n}\n`;
    }
  }

  return `${docComment}class Solution {\n    \n}\n`;
}
