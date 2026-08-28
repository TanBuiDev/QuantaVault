import type { CasesData, LanguageContractParameter } from "../cases";

function valueToJavaLiteral(value: unknown, typeHint?: string): string {
  if (value === null || value === undefined) {
    if (typeHint?.startsWith("List") || typeHint?.includes("Node") || typeHint === "String") {
      return "null";
    }
    return "null";
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (typeof value === "number") {
    if (typeHint === "double" || typeHint === "Double") {
      return Number.isInteger(value) ? `${value}.0` : `${value}`;
    }
    if (typeHint === "long" || typeHint === "Long") {
      return `${value}L`;
    }
    return `${value}`;
  }

  if (typeof value === "string") {
    if (typeHint === "char" || typeHint === "Character") {
      const escaped = value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
      return `'${escaped}'`;
    }
    const escaped = value
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t");
    return `"${escaped}"`;
  }

  if (Array.isArray(value)) {
    if (typeHint === "ListNode") {
      const elems = value.map((v) => `${v}`).join(", ");
      return `ListNode.fromArray(new int[]{${elems}})`;
    }
    if (typeHint === "TreeNode") {
      const elems = value.map((v) => (v === null ? "null" : `${v}`)).join(", ");
      return `TreeNode.fromArray(new Integer[]{${elems}})`;
    }
    if (typeHint?.startsWith("List<List<")) {
      const inner = value.map((v) => valueToJavaLiteral(v, "List<Integer>")).join(", ");
      return `Arrays.asList(${inner})`;
    }
    if (typeHint?.startsWith("List<")) {
      const inner = value.map((v) => valueToJavaLiteral(v)).join(", ");
      return `Arrays.asList(${inner})`;
    }

    if (value.length > 0 && Array.isArray(value[0])) {
      // 2D Array
      if (typeHint === "char[][]") {
        const rows = value.map((row) => `new char[]{${row.map((c: string) => `'${c}'`).join(", ")}}`);
        return `new char[][]{${rows.join(", ")}}`;
      }
      if (typeHint === "String[][]") {
        const rows = value.map((row) => `new String[]{${row.map((s: string) => `"${s}"`).join(", ")}}`);
        return `new String[][]{${rows.join(", ")}}`;
      }
      const rows = value.map((row) => `new int[]{${row.join(", ")}}`);
      return `new int[][]{${rows.join(", ")}}`;
    }

    // 1D Array
    if (typeHint === "char[]") {
      return `new char[]{${value.map((c: string) => `'${c}'`).join(", ")}}`;
    }
    if (typeHint === "String[]") {
      return `new String[]{${value.map((s: string) => `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`).join(", ")}}`;
    }
    if (typeHint === "boolean[]") {
      return `new boolean[]{${value.join(", ")}}`;
    }
    if (typeHint === "double[]") {
      return `new double[]{${value.join(", ")}}`;
    }
    if (typeHint === "long[]") {
      return `new long[]{${value.map((v) => `${v}L`).join(", ")}}`;
    }

    return `new int[]{${value.join(", ")}}`;
  }

  return JSON.stringify(value);
}

function getFormatPrinter(type?: string): string {
  if (!type) return "String.valueOf";
  if (type === "int[]" || type === "boolean[]" || type === "char[]" || type === "double[]" || type === "long[]") {
    return "Arrays.toString";
  }
  if (type.endsWith("[]")) {
    return "Arrays.deepToString";
  }
  if (type === "ListNode") {
    return "ListNode.toString";
  }
  if (type === "TreeNode") {
    return "TreeNode.toString";
  }
  return "String.valueOf";
}

function getEqualityCheck(varActual: string, varExpected: string, type?: string): string {
  if (!type) return `Objects.equals(${varActual}, ${varExpected})`;
  if (["int", "long", "double", "float", "boolean", "char", "byte", "short"].includes(type)) {
    return `${varActual} == ${varExpected}`;
  }
  if (type === "int[]" || type === "boolean[]" || type === "char[]" || type === "double[]" || type === "long[]") {
    return `Arrays.equals(${varActual}, ${varExpected})`;
  }
  if (type.endsWith("[]")) {
    return `Arrays.deepEquals(${varActual}, ${varExpected})`;
  }
  if (type === "ListNode") {
    return `ListNode.equals(${varActual}, ${varExpected})`;
  }
  if (type === "TreeNode") {
    return `TreeNode.equals(${varActual}, ${varExpected})`;
  }
  return `Objects.equals(${varActual}, ${varExpected})`;
}

export function generateJavaSource(userCode: string, casesData: CasesData | null): string {
  const helpers = `
// --- LEETCODE STANDARD DATA STRUCTURES & HELPERS ---
class ListNode {
    public int val;
    public ListNode next;
    public ListNode() {}
    public ListNode(int val) { this.val = val; }
    public ListNode(int val, ListNode next) { this.val = val; this.next = next; }

    public static ListNode fromArray(int[] arr) {
        if (arr == null || arr.length == 0) return null;
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        for (int v : arr) {
            curr.next = new ListNode(v);
            curr = curr.next;
        }
        return dummy.next;
    }

    public static String toString(ListNode node) {
        if (node == null) return "[]";
        StringBuilder sb = new StringBuilder("[");
        ListNode curr = node;
        int count = 0;
        while (curr != null && count < 1000) {
            sb.append(curr.val);
            if (curr.next != null) sb.append(",");
            curr = curr.next;
            count++;
        }
        if (count == 1000) sb.append("...");
        sb.append("]");
        return sb.toString();
    }

    public static boolean equals(ListNode l1, ListNode l2) {
        ListNode c1 = l1, c2 = l2;
        while (c1 != null && c2 != null) {
            if (c1.val != c2.val) return false;
            c1 = c1.next;
            c2 = c2.next;
        }
        return c1 == null && c2 == null;
    }
}

class TreeNode {
    public int val;
    public TreeNode left;
    public TreeNode right;
    public TreeNode() {}
    public TreeNode(int val) { this.val = val; }
    public TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }

    public static TreeNode fromArray(Integer[] arr) {
        if (arr == null || arr.length == 0 || arr[0] == null) return null;
        TreeNode root = new TreeNode(arr[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        int i = 1;
        while (!queue.isEmpty() && i < arr.length) {
            TreeNode curr = queue.poll();
            if (i < arr.length && arr[i] != null) {
                curr.left = new TreeNode(arr[i]);
                queue.offer(curr.left);
            }
            i++;
            if (i < arr.length && arr[i] != null) {
                curr.right = new TreeNode(arr[i]);
                queue.offer(curr.right);
            }
            i++;
        }
        return root;
    }

    public static String toString(TreeNode root) {
        if (root == null) return "[]";
        List<String> list = new ArrayList<>();
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        while (!q.isEmpty()) {
            TreeNode node = q.poll();
            if (node == null) {
                list.add("null");
            } else {
                list.add(String.valueOf(node.val));
                q.offer(node.left);
                q.offer(node.right);
            }
        }
        while (!list.isEmpty() && list.get(list.size() - 1).equals("null")) {
            list.remove(list.size() - 1);
        }
        return "[" + String.join(",", list) + "]";
    }

    public static boolean equals(TreeNode t1, TreeNode t2) {
        if (t1 == null && t2 == null) return true;
        if (t1 == null || t2 == null) return false;
        return t1.val == t2.val && equals(t1.left, t2.left) && equals(t1.right, t2.right);
    }
}
`;

  // Clean user code from any public class declarations so it doesn't collide with public class Main
  const sanitizedUserCode = userCode.replace(/public\s+class\s+([A-Za-z0-9_]+)/g, "class $1");

  if (!casesData || !casesData.cases || casesData.cases.length === 0) {
    return `import java.util.*;
import java.io.*;

${helpers}

public class Main {
    public static void main(String[] args) {
        System.out.println("No test cases defined.");
    }
}

${sanitizedUserCode}
`;
  }

  const { contract_type, language_contract, cases } = casesData;

  if (contract_type === "operation-sequence" && language_contract?.class) {
    const className = language_contract.class;
    let testRunnerCode = "";

    cases.forEach((tc, idx) => {
      const ops = tc.operations || [];
      const argsList = tc.arguments || [];
      const expectedArr = tc.expected || [];

      testRunnerCode += `
        // --- CASE ${idx}: ${tc.name} ---
        System.out.println("__CASE_START__ " + ${idx});
        long tStart${idx} = System.nanoTime();
        try {
            ${className} obj = null;
            List<Object> actualList = new ArrayList<>();
            ${ops
              .map((op, opIdx) => {
                const callArgs = (argsList[opIdx] || []).map((a) => JSON.stringify(a)).join(", ");
                if (op === className) {
                  return `obj = new ${className}(${callArgs}); actualList.add(null);`;
                }
                return `actualList.add(obj.${op}(${callArgs}));`;
              })
              .join("\n            ")}

            long tEnd${idx} = System.nanoTime();
            double durationMs${idx} = (tEnd${idx} - tStart${idx}) / 1e6;

            String actualStr = actualList.toString();
            String expectedStr = ${JSON.stringify(JSON.stringify(expectedArr))};
            
            // Check equality
            boolean pass = actualStr.replace(" ", "").equals(expectedStr.replace(" ", ""));
            System.out.println("__STATUS__ " + (pass ? "PASS" : "FAIL"));
            System.out.println("__ACTUAL__ " + actualStr);
            System.out.println("__EXPECTED__ " + expectedStr);
            System.out.println("__TIME_MS__ " + durationMs${idx});
        } catch (Throwable e) {
            System.out.println("__STATUS__ ERROR");
            System.out.println("__ERROR__ " + e.getClass().getName() + ": " + e.getMessage());
            e.printStackTrace(System.out);
        }
        System.out.println("__CASE_END__ " + ${idx});
      `;
    });

    return `import java.util.*;
import java.io.*;

${helpers}

public class Main {
    public static void main(String[] args) {
        ${testRunnerCode}
    }
}

${sanitizedUserCode}
`;
  }

  // Contract type: method
  const targetClass = language_contract?.class || "Solution";
  const targetMethod = language_contract?.method || "solve";
  const params: LanguageContractParameter[] = language_contract?.parameters || [];
  const returnType = language_contract?.return_type || "void";

  let testRunnerCode = "";

  cases.forEach((tc, idx) => {
    const inputObj = tc.input || {};
    const hasMutation = Boolean(tc.expected_mutation);
    const expectedMutation = tc.expected_mutation;
    const isVoid = returnType === "void";

    // Build argument instantiations
    const paramInits: string[] = [];
    const callArgs: string[] = [];

    params.forEach((param) => {
      const val = inputObj[param.name];
      const varName = `case${idx}_${param.name}`;
      paramInits.push(`${param.type} ${varName} = ${valueToJavaLiteral(val, param.type)};`);
      callArgs.push(varName);
    });

    let invocation = "";
    if (isVoid) {
      invocation = `sol.${targetMethod}(${callArgs.join(", ")});`;
    } else {
      invocation = `${returnType} actual = sol.${targetMethod}(${callArgs.join(", ")});`;
    }

    let checkLogic = "";
    if (hasMutation && expectedMutation) {
      const mutationChecks: string[] = [];
      const formatPrints: string[] = [];
      const expectedPrints: string[] = [];

      Object.entries(expectedMutation).forEach(([mutKey, mutVal]) => {
        const paramDef = params.find((p) => p.name === mutKey);
        const pType = paramDef?.type || "int[]";
        const expectedLiteral = valueToJavaLiteral(mutVal, pType);
        const printer = getFormatPrinter(pType);
        mutationChecks.push(getEqualityCheck(`case${idx}_${mutKey}`, expectedLiteral, pType));
        formatPrints.push(`${printer}(case${idx}_${mutKey})`);
        expectedPrints.push(`${printer}(${expectedLiteral})`);
      });

      checkLogic = `
            boolean pass = ${mutationChecks.join(" && ")};
            System.out.println("__STATUS__ " + (pass ? "PASS" : "FAIL"));
            System.out.println("__ACTUAL__ " + ${formatPrints.join(" + \", \" + ")});
            System.out.println("__EXPECTED__ " + ${expectedPrints.join(" + \", \" + ")});
      `;
    } else {
      const expectedLiteral = valueToJavaLiteral(tc.expected, returnType);
      const printer = getFormatPrinter(returnType);
      const equality = getEqualityCheck("actual", expectedLiteral, returnType);

      checkLogic = `
            ${returnType} expected = ${expectedLiteral};
            boolean pass = ${equality};
            System.out.println("__STATUS__ " + (pass ? "PASS" : "FAIL"));
            System.out.println("__ACTUAL__ " + ${printer}(actual));
            System.out.println("__EXPECTED__ " + ${printer}(expected));
      `;
    }

    testRunnerCode += `
        // --- CASE ${idx}: ${tc.name} ---
        System.out.println("__CASE_START__ " + ${idx});
        long tStart${idx} = System.nanoTime();
        try {
            ${paramInits.join("\n            ")}
            ${invocation}
            long tEnd${idx} = System.nanoTime();
            double durationMs${idx} = (tEnd${idx} - tStart${idx}) / 1e6;

            ${checkLogic}
            System.out.println("__TIME_MS__ " + durationMs${idx});
        } catch (Throwable e) {
            System.out.println("__STATUS__ ERROR");
            System.out.println("__ERROR__ " + e.getClass().getName() + ": " + (e.getMessage() != null ? e.getMessage() : ""));
            e.printStackTrace(System.out);
        }
        System.out.println("__CASE_END__ " + ${idx});
    `;
  });

  return `import java.util.*;
import java.io.*;

${helpers}

public class Main {
    public static void main(String[] args) {
        ${targetClass} sol = new ${targetClass}();
        ${testRunnerCode}
    }
}

${sanitizedUserCode}
`;
}
