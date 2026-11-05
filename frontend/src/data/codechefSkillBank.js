/**
 * STATWISE AI - CodeChef Skill Assessment Bank
 * Comprehensive test catalog for:
 * 1. Technical Skills:
 *    - Python, Java, C, SQL
 *    - Machine Learning
 *    - Data Structures and Algorithms
 *    - Web Development
 *    - Cloud Computing
 * 
 * 2. Professional Skills:
 *    - Communication
 *    - Teamwork
 *    - Leadership
 *    - Problem-solving
 *    - Time management
 * 
 * Each test consists of exactly 20 questions structured in 4 sequential subjects (5 questions per subject),
 * plus an interactive CodeChef coding challenge for technical programming domains.
 */

export const CODECHEF_SKILL_TESTS = {
  // ============================================================
  // 1. PYTHON
  // ============================================================
  python: {
    id: "codechef-python",
    skill: "Python",
    category: "Technical",
    codechefCode: "CC-PYTH20",
    title: "CodeChef Python 3 Industry Competency Test",
    difficulty: "CodeChef 3★ (Intermediate)",
    durationMinutes: 20,
    totalQuestions: 20,
    passingScore: 60,
    benchmarkScore: 80,
    description: "Industry-standard CodeChef assessment testing core Python syntax, functional paradigms, OOP structures, and memory collections.",
    subjects: [
      { id: 1, name: "Python Syntax, Built-in Data Types & Variables", questionRange: "Q1 - Q5" },
      { id: 2, name: "Control Structures, Iterators & Functions", questionRange: "Q6 - Q10" },
      { id: 3, name: "Object-Oriented Programming (OOP) & Classes", questionRange: "Q11 - Q15" },
      { id: 4, name: "Data Structures, Modules & Exception Handling", questionRange: "Q16 - Q20" },
    ],
    codingProblem: {
      problemCode: "CC-PY201",
      title: "Balanced Subarray Sum",
      timeLimit: "1.0s",
      memoryLimit: "256 MB",
      languages: ["Python 3", "PyPy 3"],
      description: "Given an array of integers `nums` and an integer `k`, find the total number of continuous subarrays whose sum equals `k`. Implement an optimal O(N) hash map solution.",
      inputFormat: "First line contains two integers N and k. Second line contains N space-separated integers.",
      outputFormat: "Print the count of continuous subarrays whose sum is equal to k.",
      constraints: "1 <= N <= 10^5\n-1000 <= nums[i] <= 1000\n-10^7 <= k <= 10^7",
      sampleInput: "3 2\n1 1 1",
      sampleOutput: "2",
      sampleExplanation: "The subarrays [1, 1] at indices (0, 1) and (1, 2) both sum up to 2.",
      starterCode: `def solve(nums, k):\n    # Write your optimal O(N) solution here\n    prefix_counts = {0: 1}\n    curr_sum = 0\n    ans = 0\n    for x in nums:\n        curr_sum += x\n        if curr_sum - k in prefix_counts:\n            ans += prefix_counts[curr_sum - k]\n        prefix_counts[curr_sum] = prefix_counts.get(curr_sum, 0) + 1\n    return ans\n\nif __name__ == '__main__':\n    import sys\n    lines = sys.stdin.read().split()\n    if lines:\n        n, k = int(lines[0]), int(lines[1])\n        arr = [int(x) for x in lines[2:2+n]]\n        print(solve(arr, k))`
    },
    questions: [
      // Subject 1: Syntax & Data Types (Q1 - Q5)
      {
        id: "py-q1",
        subjectId: 1,
        subjectName: "Python Syntax, Built-in Data Types & Variables",
        question: "What is the output of `type(lambda x: x)` in Python 3?",
        options: ["<class 'function'>", "<class 'lambda'>", "<class 'object'>", "<class 'expression'>"],
        correctIndex: 0,
        explanation: "Lambda expressions produce standard function objects of type <class 'function'>."
      },
      {
        id: "py-q2",
        subjectId: 1,
        subjectName: "Python Syntax, Built-in Data Types & Variables",
        question: "Which of the following built-in types in Python is immutable?",
        options: ["frozenset", "list", "dict", "bytearray"],
        correctIndex: 0,
        explanation: "frozenset and tuple are immutable, whereas list, dict, and bytearray are mutable."
      },
      {
        id: "py-q3",
        subjectId: 1,
        subjectName: "Python Syntax, Built-in Data Types & Variables",
        question: "What is the result of `2 ** 3 ** 2` in Python?",
        options: ["512", "64", "256", "128"],
        correctIndex: 0,
        explanation: "The exponentiation operator ** evaluates right-to-left: 3 ** 2 = 9, and 2 ** 9 = 512."
      },
      {
        id: "py-q4",
        subjectId: 1,
        subjectName: "Python Syntax, Built-in Data Types & Variables",
        question: "What does the expression `bool([])` evaluate to?",
        options: ["False", "True", "None", "TypeError"],
        correctIndex: 0,
        explanation: "Empty sequences and collections ([], '', (), {}) evaluate to False in boolean context."
      },
      {
        id: "py-q5",
        subjectId: 1,
        subjectName: "Python Syntax, Built-in Data Types & Variables",
        question: "What is the output of `0.1 + 0.2 == 0.3` in standard CPython?",
        options: ["False", "True", "SyntaxError", "Undefined"],
        correctIndex: 0,
        explanation: "Due to binary IEEE 754 floating point representation, 0.1 + 0.2 equals 0.30000000000000004."
      },
      // Subject 2: Control Flow & Functions (Q6 - Q10)
      {
        id: "py-q6",
        subjectId: 2,
        subjectName: "Control Structures, Iterators & Functions",
        question: "What happens when you use a mutable default argument like `def add(item, lst=[])` in Python?",
        options: [
          "The default list is created once at definition and shared across subsequent calls",
          "A fresh list is instantiated on every function invocation",
          "Python raises a UnboundLocalError at compile time",
          "The list is garbage collected after each call returns"
        ],
        correctIndex: 0,
        explanation: "Default parameter values are evaluated once when the function definition is executed."
      },
      {
        id: "py-q7",
        subjectId: 2,
        subjectName: "Control Structures, Iterators & Functions",
        question: "What does the `yield` keyword transform a Python function into?",
        options: ["A generator iterator", "A coroutine thread", "An asynchronous task", "A static method"],
        correctIndex: 0,
        explanation: "Functions containing the yield keyword return a generator object that preserves state between calls."
      },
      {
        id: "py-q8",
        subjectId: 2,
        subjectName: "Control Structures, Iterators & Functions",
        question: "In list comprehension `[x*2 for x in range(5) if x % 2 == 0]`, what is generated?",
        options: ["[0, 4, 8]", "[2, 6]", "[0, 2, 4]", "[0, 4, 16]"],
        correctIndex: 0,
        explanation: "Even numbers in range(5) are 0, 2, 4. Multiplying each by 2 gives [0, 4, 8]."
      },
      {
        id: "py-q9",
        subjectId: 2,
        subjectName: "Control Structures, Iterators & Functions",
        question: "What does the `*args` and `**kwargs` syntax unpack in function signatures?",
        options: [
          "Variable positional arguments (tuple) and keyword arguments (dictionary)",
          "Pointer references and memory addresses",
          "Integer arrays and string matrices",
          "Regular expressions and string templates"
        ],
        correctIndex: 0,
        explanation: "*args packs remaining positional arguments into a tuple; **kwargs packs keyword arguments into a dict."
      },
      {
        id: "py-q10",
        subjectId: 2,
        subjectName: "Control Structures, Iterators & Functions",
        question: "When is the `else` block of a `for` loop executed in Python?",
        options: [
          "When the loop finishes normally without encountering a `break`",
          "Whenever the iterable is empty from the start",
          "Only if an exception occurred inside the loop body",
          "After every iteration of the loop"
        ],
        correctIndex: 0,
        explanation: "A for/while loop's else clause runs when the loop terminates through exhaustion, not via a break."
      },
      // Subject 3: OOP & Classes (Q11 - Q15)
      {
        id: "py-q11",
        subjectId: 3,
        subjectName: "Object-Oriented Programming (OOP) & Classes",
        question: "What is the purpose of the `__init__` method in a Python class?",
        options: [
          "It initializes attributes of newly created instance objects",
          "It allocates raw system memory for the class definition",
          "It is the class destructor called by garbage collection",
          "It converts the class into a Singleton design pattern"
        ],
        correctIndex: 0,
        explanation: "__init__ is the initializer called after __new__ allocates the instance."
      },
      {
        id: "py-q12",
        subjectId: 3,
        subjectName: "Object-Oriented Programming (OOP) & Classes",
        question: "What algorithm does Python 3 use for Method Resolution Order (MRO) in multiple inheritance?",
        options: ["C3 Linearization", "Depth-First Search", "Dijkstra MRO", "Breadth-First Topological"],
        correctIndex: 0,
        explanation: "Python 2.3+ uses the C3 Superclass Linearization algorithm to determine method resolution order."
      },
      {
        id: "py-q13",
        subjectId: 3,
        subjectName: "Object-Oriented Programming (OOP) & Classes",
        question: "What does prefixing an attribute name with double underscores (e.g., `__balance`) achieve in a class?",
        options: [
          "Triggers name mangling to prevent accidental namespace collisions in subclasses",
          "Enforces true cryptographic private memory protection in CPython",
          "Declares a global static variable shared across threads",
          "Marks the attribute as read-only and immutable"
        ],
        correctIndex: 0,
        explanation: "Double underscore invokes name mangling: self.__var becomes _ClassName__var."
      },
      {
        id: "py-q14",
        subjectId: 3,
        subjectName: "Object-Oriented Programming (OOP) & Classes",
        question: "How does the `@classmethod` decorator differ from `@staticmethod`?",
        options: [
          "@classmethod receives the class object (`cls`) as its first parameter, whereas @staticmethod receives no implicit first argument",
          "@classmethod can only be called from instances, not from the class directly",
          "@staticmethod allows mutating instance state via self",
          "@classmethod compiles the method into C extensions"
        ],
        correctIndex: 0,
        explanation: "@classmethod binds to the class and passes cls implicitly, while @staticmethod behaves like a regular function."
      },
      {
        id: "py-q15",
        subjectId: 3,
        subjectName: "Object-Oriented Programming (OOP) & Classes",
        question: "Which dunder method must you implement to make instances of your class callable like functions (`obj()`)?",
        options: ["__call__", "__invoke__", "__exec__", "__run__"],
        correctIndex: 0,
        explanation: "Implementing __call__(self, *args, **kwargs) allows instances to be invoked with parentheses."
      },
      // Subject 4: Data Structures & Modules (Q16 - Q20)
      {
        id: "py-q16",
        subjectId: 4,
        subjectName: "Data Structures, Modules & Exception Handling",
        question: "What is the average time complexity of dictionary key lookup in Python?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
        correctIndex: 0,
        explanation: "Python dictionaries are implemented with dynamic open-addressed hash tables with O(1) average lookup."
      },
      {
        id: "py-q17",
        subjectId: 4,
        subjectName: "Data Structures, Modules & Exception Handling",
        question: "Which collection from `collections` provides an O(1) time double-ended queue for appends and pops?",
        options: ["deque", "defaultdict", "OrderedDict", "ChainMap"],
        correctIndex: 0,
        explanation: "collections.deque is implemented as a doubly linked list of blocks providing O(1) pushes/pops at both ends."
      },
      {
        id: "py-q18",
        subjectId: 4,
        subjectName: "Data Structures, Modules & Exception Handling",
        question: "What is the role of the `__enter__` and `__exit__` dunder methods?",
        options: [
          "They define the context management protocol used by `with` statements",
          "They are triggered when an imported module begins and finishes loading",
          "They define threading lock acquisition barriers",
          "They allocate and free TCP socket connection handles"
        ],
        correctIndex: 0,
        explanation: "The Context Manager protocol requires __enter__ (setup) and __exit__ (teardown/resource cleanup)."
      },
      {
        id: "py-q19",
        subjectId: 4,
        subjectName: "Data Structures, Modules & Exception Handling",
        question: "In `try...except...finally`, when does the `finally` block execute?",
        options: [
          "Always, whether an exception occurred, was caught, or a return statement was executed",
          "Only when no exception was raised in the try block",
          "Only when an unhandled exception propagates up the stack",
          "Only if the except block explicitly raised a secondary error"
        ],
        correctIndex: 0,
        explanation: "The finally clause always executes before leaving the try statement, even if a return or break is triggered."
      },
      {
        id: "py-q20",
        subjectId: 4,
        subjectName: "Data Structures, Modules & Exception Handling",
        question: "What does the `zip()` built-in function return when given iterables of unequal length?",
        options: [
          "It stops at the length of the shortest input iterable (by default in Python 3)",
          "It raises a ValueError immediately",
          "It pads missing elements with None automatically",
          "It loops back to the start of the shorter iterable"
        ],
        correctIndex: 0,
        explanation: "zip() stops when the shortest iterable is exhausted. (Use itertools.zip_longest for padding)."
      }
    ]
  },

  // ============================================================
  // 2. JAVA
  // ============================================================
  java: {
    id: "codechef-java",
    skill: "Java",
    category: "Technical",
    codechefCode: "CC-JAVA20",
    title: "CodeChef Java Enterprise Competency Test",
    difficulty: "CodeChef 3★ (Intermediate)",
    durationMinutes: 20,
    totalQuestions: 20,
    passingScore: 60,
    benchmarkScore: 80,
    description: "Evaluates JVM memory architecture, OOP principles, Java Collections, and modern concurrent streams.",
    subjects: [
      { id: 1, name: "Java Core Syntax, Primitives & Operators", questionRange: "Q1 - Q5" },
      { id: 2, name: "OOP: Inheritance, Polymorphism & Interfaces", questionRange: "Q6 - Q10" },
      { id: 3, name: "Collections Framework, Generics & Streams", questionRange: "Q11 - Q15" },
      { id: 4, name: "Exception Handling, Concurrency & JVM Internals", questionRange: "Q16 - Q20" },
    ],
    codingProblem: {
      problemCode: "CC-JAVA201",
      title: "Longest Valid Palindrome Substring",
      timeLimit: "1.5s",
      memoryLimit: "256 MB",
      languages: ["Java 17", "Java 11"],
      description: "Given a string `s`, return the length of the longest palindromic substring in `s`. Expand around centers in O(N^2) or Manacher's algorithm in O(N).",
      inputFormat: "A single line containing the string s.",
      outputFormat: "Print a single integer: the length of the longest palindromic substring.",
      constraints: "1 <= s.length <= 1000\ns consists of only digits and English letters.",
      sampleInput: "babad",
      sampleOutput: "3",
      sampleExplanation: "'bab' and 'aba' are both valid palindromes of length 3.",
      starterCode: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        String s = br.readLine();\n        if (s == null || s.length() == 0) {\n            System.out.println(0);\n            return;\n        }\n        System.out.println(longestPalindromeLength(s.trim()));\n    }\n\n    public static int longestPalindromeLength(String s) {\n        int maxLen = 1;\n        for (int i = 0; i < s.length(); i++) {\n            maxLen = Math.max(maxLen, expand(s, i, i));\n            maxLen = Math.max(maxLen, expand(s, i, i + 1));\n        }\n        return maxLen;\n    }\n\n    private static int expand(String s, int left, int right) {\n        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {\n            left--;\n            right++;\n        }\n        return right - left - 1;\n    }\n}`
    },
    questions: [
      { id: "jv-q1", subjectId: 1, subjectName: "Java Core Syntax, Primitives & Operators", question: "What is the default value of an uninitialized boolean variable declared as a class instance field in Java?", options: ["false", "true", "0", "null"], correctIndex: 0, explanation: "Instance boolean fields default to false in Java." },
      { id: "jv-q2", subjectId: 1, subjectName: "Java Core Syntax, Primitives & Operators", question: "What does the expression `String s1 = \"abc\"; String s2 = new String(\"abc\"); s1 == s2;` return?", options: ["false", "true", "NullPointerException", "Compilation Error"], correctIndex: 0, explanation: "== compares references. s1 points to the string pool, s2 points to a newly allocated heap object." },
      { id: "jv-q3", subjectId: 1, subjectName: "Java Core Syntax, Primitives & Operators", question: "What is the size in bytes of the `long` primitive data type in Java?", options: ["8 bytes (64 bits)", "4 bytes (32 bits)", "16 bytes", "Platform dependent"], correctIndex: 0, explanation: "Java primitive sizes are strictly defined by the JVM spec; a long is always 64 bits (8 bytes)." },
      { id: "jv-q4", subjectId: 1, subjectName: "Java Core Syntax, Primitives & Operators", question: "What happens when you use `final` on a class in Java?", options: ["The class cannot be extended / subclassed", "All methods inside the class become static", "Instances of the class cannot be serialized", "The class can only have private constructors"], correctIndex: 0, explanation: "A final class cannot be inherited or subclassed (e.g. java.lang.String)." },
      { id: "jv-q5", subjectId: 1, subjectName: "Java Core Syntax, Primitives & Operators", question: "What is the return type of the `hashCode()` method in `java.lang.Object`?", options: ["int", "long", "String", "byte[]"], correctIndex: 0, explanation: "public int hashCode() returns a 32-bit signed integer hash." },
      { id: "jv-q6", subjectId: 2, subjectName: "OOP: Inheritance, Polymorphism & Interfaces", question: "Can an interface in Java 8+ have concrete method implementations?", options: ["Yes, using `default` or `static` keywords", "No, interfaces can strictly only declare abstract methods", "Only if the interface extends an abstract class", "Yes, but only private methods are allowed"], correctIndex: 0, explanation: "Java 8 introduced default and static methods in interfaces to allow API evolution." },
      { id: "jv-q7", subjectId: 2, subjectName: "OOP: Inheritance, Polymorphism & Interfaces", question: "Which access modifier allows access within the same package and by subclasses in other packages?", options: ["protected", "package-private (default)", "public", "private"], correctIndex: 0, explanation: "protected grants access to package peers plus any derived subclasses across packages." },
      { id: "jv-q8", subjectId: 2, subjectName: "OOP: Inheritance, Polymorphism & Interfaces", question: "What does method overriding require regarding checked exceptions?", options: ["The overriding method cannot declare broader or new checked exceptions than the superclass method", "The overriding method must declare the exact same checked exceptions", "The overriding method must throw RuntimeException instead", "Checked exceptions are ignored during overriding"], correctIndex: 0, explanation: "An overriding method can throw fewer or narrower checked exceptions, but cannot throw broader checked ones." },
      { id: "jv-q9", subjectId: 2, subjectName: "OOP: Inheritance, Polymorphism & Interfaces", question: "What keyword is used to explicitly invoke an immediate superclass's constructor in Java?", options: ["super()", "this()", "parent()", "base()"], correctIndex: 0, explanation: "super() must be the very first statement in a constructor to invoke the superclass constructor." },
      { id: "jv-q10", subjectId: 2, subjectName: "OOP: Inheritance, Polymorphism & Interfaces", question: "What is an anonymous inner class in Java?", options: ["An inline class without a name declared and instantiated in a single expression", "A class with zero fields and only static methods", "A class located in the unnamed default package", "A class generated at runtime by ByteBuddy"], correctIndex: 0, explanation: "Anonymous classes are inner classes defined on the fly without an explicit class name identifier." },
      { id: "jv-q11", subjectId: 3, subjectName: "Collections Framework, Generics & Streams", question: "Which collection maintains elements in sorted order based on natural ordering or a Comparator?", options: ["TreeSet", "HashSet", "LinkedHashSet", "Vector"], correctIndex: 0, explanation: "TreeSet uses a Navigable Red-Black tree to maintain its elements in sorted order." },
      { id: "jv-q12", subjectId: 3, subjectName: "Collections Framework, Generics & Streams", question: "What is the difference between `HashMap` and `Hashtable`?", options: ["HashMap is unsynchronized and permits one null key; Hashtable is synchronized and permits no nulls", "HashMap maintains insertion order; Hashtable does not", "Hashtable is faster in single-threaded environments", "HashMap uses binary trees exclusively for buckets"], correctIndex: 0, explanation: "HashMap is non-thread-safe and allows null keys/values; legacy Hashtable is synchronized and rejects nulls." },
      { id: "jv-q13", subjectId: 3, subjectName: "Collections Framework, Generics & Streams", question: "What does Type Erasure in Java Generics mean?", options: ["Generic type parameters are checked at compile time and removed/replaced with Object or bounds in bytecode", "Generics are erased by the JIT compiler during memory paging", "Type parameters can only accept primitive types", "Variables cannot be cast to generic types"], correctIndex: 0, explanation: "Type erasure removes generic type annotations at compile-time to maintain backward compatibility with pre-Java 5 JVMs." },
      { id: "jv-q14", subjectId: 3, subjectName: "Collections Framework, Generics & Streams", question: "What does the intermediate stream operation `flatMap()` do?", options: ["Transforms each element into a stream and flattens resulting streams into a single output stream", "Filters out null elements and sorts the stream", "Reduces elements to a single scalar value", "Splits the stream into parallel worker chunks"], correctIndex: 0, explanation: "flatMap applies a one-to-many transformer and flattens the resulting streams." },
      { id: "jv-q15", subjectId: 3, subjectName: "Collections Framework, Generics & Streams", question: "Which interface must a class implement to be used in an enhanced for-each loop?", options: ["Iterable", "Iterator", "Collection", "Enumeration"], correctIndex: 0, explanation: "Any object that implements java.lang.Iterable can be target of the for-each loop statement." },
      { id: "jv-q16", subjectId: 4, subjectName: "Exception Handling, Concurrency & JVM Internals", question: "Which of the following is an unchecked exception (inherits from `RuntimeException`)?", options: ["NullPointerException", "IOException", "SQLException", "ClassNotFoundException"], correctIndex: 0, explanation: "NullPointerException, ArrayIndexOutOfBoundsException, and IllegalArgumentException are RuntimeExceptions (unchecked)." },
      { id: "jv-q17", subjectId: 4, subjectName: "Exception Handling, Concurrency & JVM Internals", question: "What does the `volatile` keyword guarantee in multi-threaded Java?", options: ["Visibility of changes to the variable across all CPU caches and prevents instruction reordering", "Mutual exclusion synchronization equivalent to synchronized(this)", "Atomic execution of compound increment operations like count++", "Immediate persistence to non-volatile disk storage"], correctIndex: 0, explanation: "volatile guarantees memory visibility and establishes happens-before relationships without mutual exclusion locks." },
      { id: "jv-q18", subjectId: 4, subjectName: "Exception Handling, Concurrency & JVM Internals", question: "Where are Java object instances stored in the JVM memory architecture?", options: ["Heap Memory", "Stack Memory", "Metaspace / PermGen", "Program Counter Register"], correctIndex: 0, explanation: "All Java class instances and array objects are allocated on the shared Garbage-Collected Heap." },
      { id: "jv-q19", subjectId: 4, subjectName: "Exception Handling, Concurrency & JVM Internals", question: "What is the primary role of the JIT (Just-In-Time) compiler in HotSpot JVM?", options: ["Compiles frequently executed bytecode (hot spots) directly into optimized native machine code", "Verifies class file bytecode validity during classloading", "Manages the heap generation boundaries during minor GC", "Resolves symbolic references into direct pointers"], correctIndex: 0, explanation: "JIT identifies hot code execution paths and translates bytecode into native host CPU instructions." },
      { id: "jv-q20", subjectId: 4, subjectName: "Exception Handling, Concurrency & JVM Internals", question: "What is the purpose of `try-with-resources` introduced in Java 7?", options: ["Automatically closes resources implementing `AutoCloseable` upon try block completion", "Runs code in parallel on virtual threads", "Catches both checked and unchecked errors simultaneously", "Suppresses all thread interruption signals"], correctIndex: 0, explanation: "try-with-resources guarantees deterministic cleanup for any resource implementing AutoCloseable." }
    ]
  },

  // ============================================================
  // 3. C PROGRAMMING
  // ============================================================
  c: {
    id: "codechef-c",
    skill: "C",
    category: "Technical",
    codechefCode: "CC-CPROG20",
    title: "CodeChef C Systems & Low-Level Competency Test",
    difficulty: "CodeChef 3★ (Intermediate)",
    durationMinutes: 20,
    totalQuestions: 20,
    passingScore: 60,
    benchmarkScore: 80,
    description: "Evaluates manual pointer arithmetic, dynamic memory allocation, structs, bitwise manipulations, and systems programming.",
    subjects: [
      { id: 1, name: "C Syntax, Types, Operators & Control Flow", questionRange: "Q1 - Q5" },
      { id: 2, name: "Pointers, Addresses & Memory Allocation", questionRange: "Q6 - Q10" },
      { id: 3, name: "Arrays, Strings, Structs & Unions", questionRange: "Q11 - Q15" },
      { id: 4, name: "Preprocessor, File I/O & Memory Optimization", questionRange: "Q16 - Q20" },
    ],
    codingProblem: {
      problemCode: "CC-C201",
      title: "Reverse Singly Linked List",
      timeLimit: "1.0s",
      memoryLimit: "128 MB",
      languages: ["C (gcc)", "C11"],
      description: "Given the head of a singly linked list, reverse the list in-place using O(1) extra space and return the reversed list head.",
      inputFormat: "First line contains N, the number of nodes. Second line contains N integers representing node values.",
      outputFormat: "Print the reversed list node values space-separated.",
      constraints: "0 <= N <= 5000\n-5000 <= Node.val <= 5000",
      sampleInput: "5\n1 2 3 4 5",
      sampleOutput: "5 4 3 2 1",
      sampleExplanation: "The list 1->2->3->4->5 reversed becomes 5->4->3->2->1.",
      starterCode: `#include <stdio.h>\n#include <stdlib.h>\n\nstruct Node {\n    int val;\n    struct Node* next;\n};\n\nstruct Node* reverseList(struct Node* head) {\n    struct Node* prev = NULL;\n    struct Node* curr = head;\n    struct Node* next = NULL;\n    while (curr != NULL) {\n        next = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}\n\nint main() {\n    int n;\n    if (scanf("%d", &n) != 1 || n <= 0) return 0;\n    struct Node* head = NULL;\n    struct Node* tail = NULL;\n    for (int i = 0; i < n; i++) {\n        int v;\n        scanf("%d", &v);\n        struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));\n        newNode->val = v;\n        newNode->next = NULL;\n        if (!head) head = tail = newNode;\n        else { tail->next = newNode; tail = newNode; }\n    }\n    struct Node* rev = reverseList(head);\n    while (rev) {\n        printf("%d ", rev->val);\n        rev = rev->next;\n    }\n    printf("\\n");\n    return 0;\n}`
    },
    questions: [
      { id: "c-q1", subjectId: 1, subjectName: "C Syntax, Types, Operators & Control Flow", question: "What is the return type of `sizeof` operator in standard C?", options: ["size_t", "int", "unsigned long long", "long"], correctIndex: 0, explanation: "sizeof yields an unsigned integer type of at least 16 bits represented by size_t." },
      { id: "c-q2", subjectId: 1, subjectName: "C Syntax, Types, Operators & Control Flow", question: "What does the expression `5 & 3` evaluate to in C?", options: ["1", "7", "2", "0"], correctIndex: 0, explanation: "Bitwise AND: 5 (101_2) & 3 (011_2) = 1 (001_2)." },
      { id: "c-q3", subjectId: 1, subjectName: "C Syntax, Types, Operators & Control Flow", question: "What happens if a function without a prototype is called in C99?", options: ["It violates C99 standards (implicit function declaration is removed)", "It defaults to returning a void pointer", "It executes with undefined dynamic link libraries", "The compiler auto-generates a struct"], correctIndex: 0, explanation: "Implicit function declarations were standard in C89, but were removed and prohibited in C99." },
      { id: "c-q4", subjectId: 1, subjectName: "C Syntax, Types, Operators & Control Flow", question: "What is the value of `x` after `int a = 5; int x = a++;`?", options: ["x = 5, a = 6", "x = 6, a = 6", "x = 5, a = 5", "x = 6, a = 5"], correctIndex: 0, explanation: "Postfix ++ returns the original value before incrementing a to 6." },
      { id: "c-q5", subjectId: 1, subjectName: "C Syntax, Types, Operators & Control Flow", question: "In a `switch` statement, what happens if no `break` is placed after a matching case?", options: ["Execution falls through to the subsequent case statements", "The switch statement terminates immediately", "A compilation error occurs", "The program aborts with a SIGSEGV"], correctIndex: 0, explanation: "Case statements fall through until a break statement or closing brace is reached." },
      { id: "c-q6", subjectId: 2, subjectName: "Pointers, Addresses & Memory Allocation", question: "If `int arr[5] = {10, 20, 30, 40, 50}; int *p = arr;`, what is `*(p + 2)`?", options: ["30", "20", "40", "Address of arr[2]"], correctIndex: 0, explanation: "Pointer arithmetic increments by 2 * sizeof(int), dereferencing arr[2] which is 30." },
      { id: "c-q7", subjectId: 2, subjectName: "Pointers, Addresses & Memory Allocation", question: "What is the key difference between `malloc()` and `calloc()`?", options: ["`calloc()` zeroes out the allocated memory; `malloc()` leaves memory uninitialized (garbage values)", "`malloc()` allocates on stack; `calloc()` allocates on heap", "`calloc()` can resize existing memory chunks", "`malloc()` can never fail and return NULL"], correctIndex: 0, explanation: "calloc(n, size) initializes all allocated bytes to zero; malloc(bytes) leaves them with garbage values." },
      { id: "c-q8", subjectId: 2, subjectName: "Pointers, Addresses & Memory Allocation", question: "What is a 'dangling pointer' in C?", options: ["A pointer pointing to a memory location that has already been deallocated via `free()`", "A pointer initialized to NULL", "A pointer pointing to constant read-only string literals", "A void pointer before casting"], correctIndex: 0, explanation: "A dangling pointer holds an address to deallocated heap or out-of-scope stack memory." },
      { id: "c-q9", subjectId: 2, subjectName: "Pointers, Addresses & Memory Allocation", question: "What does `void *` represent in C?", options: ["A generic pointer type that can hold the address of any data type without a cast", "A pointer that points to nothing and cannot be changed", "A function pointer that takes no arguments", "An invalid null pointer"], correctIndex: 0, explanation: "void* is a universal pointer that can be converted to and from any object pointer type." },
      { id: "c-q10", subjectId: 2, subjectName: "Pointers, Addresses & Memory Allocation", question: "What library function is used to dynamically deallocate memory previously allocated by `malloc`?", options: ["free()", "delete()", "release()", "dealloc()"], correctIndex: 0, explanation: "free(ptr) releases memory back to the heap to prevent memory leaks." },
      { id: "c-q11", subjectId: 3, subjectName: "Arrays, Strings, Structs & Unions", question: "What character marks the end of a string literal in C?", options: ["'\\0' (Null terminator)", "'\\n'", "'EOF'", "';'"], correctIndex: 0, explanation: "C strings are null-terminated byte arrays ending with the byte 0x00 ('\\0')." },
      { id: "c-q12", subjectId: 3, subjectName: "Arrays, Strings, Structs & Unions", question: "What is the memory size of a `union` in C?", options: ["The size of its largest member variable (plus alignment padding)", "The sum of all its member variables", "Fixed at 8 bytes regardless of members", "Zero until instantiated"], correctIndex: 0, explanation: "In a union, all members share the same memory location, so its size equals its largest member." },
      { id: "c-q13", subjectId: 3, subjectName: "Arrays, Strings, Structs & Unions", question: "Given `struct Student { int id; char name[20]; }; struct Student s; struct Student *ptr = &s;`, how do you access `id` through `ptr`?", options: ["ptr->id", "ptr.id", "*ptr.id", "ptr=>id"], correctIndex: 0, explanation: "The arrow operator (->) dereferences the pointer and accesses the member field." },
      { id: "c-q14", subjectId: 3, subjectName: "Arrays, Strings, Structs & Unions", question: "What is array decay in C?", options: ["An array identifier implicitly converting to a pointer to its first element when passed to a function", "Memory corruption due to buffer overflow", "Compacting duplicate array values", "Deallocating array memory automatically"], correctIndex: 0, explanation: "In most expressions (including function arguments), an array type decays into a pointer to its initial element." },
      { id: "c-q15", subjectId: 3, subjectName: "Arrays, Strings, Structs & Unions", question: "Which function safely copies at most `n` characters from source to destination string in `<string.h>`?", options: ["strncpy()", "strcpy()", "sprintf()", "strcat()"], correctIndex: 0, explanation: "strncpy prevents buffer overflows by capping characters copied to n." },
      { id: "c-q16", subjectId: 4, subjectName: "Preprocessor, File I/O & Memory Optimization", question: "What does the preprocessor directive `#pragma once` accomplish?", options: ["Ensures the header file is included only once during compilation", "Allocates the translation unit on high-speed L1 cache", "Forces single-threaded execution", "Disables all compiler optimization warnings"], correctIndex: 0, explanation: "#pragma once serves as an include guard preventing multiple compilation of the same header." },
      { id: "c-q17", subjectId: 4, subjectName: "Preprocessor, File I/O & Memory Optimization", question: "What is structure padding in C?", options: ["Compiler-inserted idle bytes between struct members to align data on word boundaries for fast CPU access", "Adding extra characters to strings to prevent overflows", "Initializing structs with zeroes", "Packing structs tightly to minimize file storage"], correctIndex: 0, explanation: "Compilers insert padding bytes so variables align with architecture word boundaries (e.g. 4 or 8 bytes)." },
      { id: "c-q18", subjectId: 4, subjectName: "Preprocessor, File I/O & Memory Optimization", question: "What mode should be passed to `fopen()` to open a binary file for appending data?", options: ["\"ab\"", "\"a\"", "\"wb\"", "\"rb+\""], correctIndex: 0, explanation: "\"ab\" opens or creates a binary file for appending to the end." },
      { id: "c-q19", subjectId: 4, subjectName: "Preprocessor, File I/O & Memory Optimization", question: "What is the scope of a variable declared with `static` inside a C function?", options: ["Local scope to the function, but lifetime persists across the entire duration of the program", "Global scope accessible from all translation units", "Destroyed as soon as the function returns", "Allocated in the CPU register file"], correctIndex: 0, explanation: "A static local variable retains its value between function invocations." },
      { id: "c-q20", subjectId: 4, subjectName: "Preprocessor, File I/O & Memory Optimization", question: "What does the macro `NULL` typically expand to in standard C?", options: ["((void *)0)", "0", "false", "Both ((void *)0) or 0 depending on implementation"], correctIndex: 3, explanation: "The C standard defines NULL as an integer constant expression with value 0, or such an expression cast to void*." }
    ]
  },

  // ============================================================
  // 4. SQL & DATABASES
  // ============================================================
  sql: {
    id: "codechef-sql",
    skill: "SQL & Databases",
    category: "Technical",
    codechefCode: "CC-SQL20",
    title: "CodeChef SQL & Relational Engine Competency Test",
    difficulty: "CodeChef 3★ (Intermediate)",
    durationMinutes: 20,
    totalQuestions: 20,
    passingScore: 60,
    benchmarkScore: 80,
    description: "Evaluates DDL/DML, multi-table joins, subqueries, grouping aggregations, window analytics, and index tuning.",
    subjects: [
      { id: 1, name: "DDL/DML, Basic Queries & Filtering", questionRange: "Q1 - Q5" },
      { id: 2, name: "Multi-Table Joins & Nested Subqueries", questionRange: "Q6 - Q10" },
      { id: 3, name: "Aggregations, Grouping & Set Operations", questionRange: "Q11 - Q15" },
      { id: 4, name: "Window Functions, Indexing & ACID Transactions", questionRange: "Q16 - Q20" },
    ],
    codingProblem: {
      problemCode: "CC-SQL201",
      title: "Department Top Earners",
      timeLimit: "2.0s",
      memoryLimit: "256 MB",
      languages: ["PostgreSQL", "MySQL 8.0"],
      description: "Write a SQL query to find employees who have the highest salary in each department. If multiple employees share the maximum salary, include all of them.",
      inputFormat: "Table: Employee (id INT, name VARCHAR, salary INT, departmentId INT)\nTable: Department (id INT, name VARCHAR)",
      outputFormat: "Output columns: Department, Employee, Salary",
      constraints: "1 <= Employee.rows <= 10^5\n1 <= Department.rows <= 100",
      sampleInput: "Employee: [(1,'Joe',70000,1),(2,'Jim',90000,1),(3,'Henry',80000,2),(4,'Sam',60000,2)]\nDepartment: [(1,'IT'),(2,'Sales')]",
      sampleOutput: "[('IT','Jim',90000),('Sales','Henry',80000)]",
      sampleExplanation: "Jim has the top salary in IT (90000) and Henry has the top salary in Sales (80000).",
      starterCode: `SELECT \n    d.name AS Department,\n    e.name AS Employee,\n    e.salary AS Salary\nFROM Employee e\nJOIN Department d ON e.departmentId = d.id\nWHERE (e.departmentId, e.salary) IN (\n    SELECT departmentId, MAX(salary)\n    FROM Employee\n    GROUP BY departmentId\n);`
    },
    questions: [
      { id: "sql-q1", subjectId: 1, subjectName: "DDL/DML, Basic Queries & Filtering", question: "Which SQL clause is used to filter rows before any groupings are applied?", options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"], correctIndex: 0, explanation: "WHERE filters rows before grouping; HAVING filters aggregated groups." },
      { id: "sql-q2", subjectId: 1, subjectName: "DDL/DML, Basic Queries & Filtering", question: "What is the difference between `DELETE` and `TRUNCATE` in SQL?", options: ["TRUNCATE is DDL, deallocates entire pages without logging individual rows, and is faster than DELETE", "DELETE removes table structure while TRUNCATE preserves columns", "TRUNCATE can use WHERE clauses", "DELETE cannot be rolled back in a transaction"], correctIndex: 0, explanation: "TRUNCATE is a fast DDL command that resets the table without firing individual row-level triggers." },
      { id: "sql-q3", subjectId: 1, subjectName: "DDL/DML, Basic Queries & Filtering", question: "What does the SQL statement `SELECT DISTINCT department, city FROM Employees;` return?", options: ["Unique combinations of department and city pairs", "Unique departments and every city", "All departments sorted alphabetically", "Only rows where department and city have the same name"], correctIndex: 0, explanation: "DISTINCT applies to the entire set of selected columns as a composite tuple." },
      { id: "sql-q4", subjectId: 1, subjectName: "DDL/DML, Basic Queries & Filtering", question: "How do you test for a NULL value in an SQL query?", options: ["WHERE column_name IS NULL", "WHERE column_name = NULL", "WHERE column_name == NULL", "WHERE column_name IS EQUAL TO NULL"], correctIndex: 0, explanation: "NULL represents unknown and cannot be compared with equality operators; IS NULL must be used." },
      { id: "sql-q5", subjectId: 1, subjectName: "DDL/DML, Basic Queries & Filtering", question: "Which wildcard in `LIKE` matches any sequence of zero or more characters in SQL?", options: ["%", "_", "*", "?"], correctIndex: 0, explanation: "% matches zero or more characters; _ matches exactly one character." },
      { id: "sql-q6", subjectId: 2, subjectName: "Multi-Table Joins & Nested Subqueries", question: "What rows are returned by a `LEFT JOIN` between Table A and Table B?", options: ["All rows from Table A, plus matched rows from Table B (with NULLs for unmatched B rows)", "Only rows that match in both Table A and Table B", "All rows from Table B, plus matched rows from Table A", "The Cartesian product of both tables"], correctIndex: 0, explanation: "LEFT JOIN preserves all records from the left table and populates missing right-side values with NULL." },
      { id: "sql-q7", subjectId: 2, subjectName: "Multi-Table Joins & Nested Subqueries", question: "What is a correlated subquery in SQL?", options: ["A subquery that references columns from the outer query and executes once for every candidate row of the outer query", "A subquery that executes only once before the main query", "A subquery containing a JOIN between three or more tables", "A subquery located in the FROM clause with an alias"], correctIndex: 0, explanation: "Correlated subqueries depend on the outer query's current row values for their evaluation." },
      { id: "sql-q8", subjectId: 2, subjectName: "Multi-Table Joins & Nested Subqueries", question: "If Table A has 5 rows and Table B has 4 rows, how many rows does a `CROSS JOIN` produce?", options: ["20 rows", "9 rows", "5 rows", "1 row"], correctIndex: 0, explanation: "CROSS JOIN produces the Cartesian product: 5 * 4 = 20 rows." },
      { id: "sql-q9", subjectId: 2, subjectName: "Multi-Table Joins & Nested Subqueries", question: "What does the `EXISTS` operator evaluate in SQL?", options: ["Returns TRUE as soon as the subquery returns at least one row", "Returns TRUE only if all subquery rows match the condition", "Counts the total number of rows in the table", "Checks if a column index exists"], correctIndex: 0, explanation: "EXISTS terminates early and returns TRUE as soon as the first matching record is found." },
      { id: "sql-q10", subjectId: 2, subjectName: "Multi-Table Joins & Nested Subqueries", question: "What is the difference between `UNION` and `UNION ALL`?", options: ["UNION removes duplicate rows; UNION ALL retains all rows including duplicates", "UNION ALL performs a natural join; UNION does not", "UNION is faster than UNION ALL", "UNION ALL sorts the resulting dataset automatically"], correctIndex: 0, explanation: "UNION performs a deduplication sort pass; UNION ALL concatenates without deduplication and is faster." },
      { id: "sql-q11", subjectId: 3, subjectName: "Aggregations, Grouping & Set Operations", question: "What does `COUNT(*)` count compared to `COUNT(column_name)`?", options: ["COUNT(*) counts all rows including NULLs; COUNT(col) counts only non-NULL values of that column", "COUNT(*) only counts primary keys", "COUNT(col) is always faster than COUNT(*)", "There is no difference in relational engines"], correctIndex: 0, explanation: "COUNT(*) counts total row occurrences; COUNT(col) skips rows where column_name is NULL." },
      { id: "sql-q12", subjectId: 3, subjectName: "Aggregations, Grouping & Set Operations", question: "When MUST the `HAVING` clause be used instead of `WHERE`?", options: ["When filtering on aggregated values like `SUM()`, `AVG()`, or `COUNT()`", "When joining more than two tables", "When sorting in descending order", "When selecting from views"], correctIndex: 0, explanation: "Aggregates cannot appear in WHERE clauses; they must be filtered using HAVING." },
      { id: "sql-q13", subjectId: 3, subjectName: "Aggregations, Grouping & Set Operations", question: "Which clause allows generating multi-level subtotal rollups in SQL?", options: ["GROUP BY ROLLUP(col1, col2)", "GROUP BY DISTINCT", "ORDER BY SUBTOTAL", "PARTITION BY TOTAL"], correctIndex: 0, explanation: "ROLLUP generates progressive subtotal aggregations along with a grand total." },
      { id: "sql-q14", subjectId: 3, subjectName: "Aggregations, Grouping & Set Operations", question: "What is the result of `AVG(salary)` when rows have values `100, 200, NULL`?", options: ["150", "100", "NULL", "0"], correctIndex: 0, explanation: "Aggregate functions ignore NULL values: (100 + 200) / 2 = 150." },
      { id: "sql-q15", subjectId: 3, subjectName: "Aggregations, Grouping & Set Operations", question: "What operator finds rows present in Table A but NOT present in Table B?", options: ["EXCEPT (or MINUS)", "INTERSECT", "UNION", "OUTER JOIN"], correctIndex: 0, explanation: "EXCEPT in SQL:2003 (MINUS in Oracle) returns set difference." },
      { id: "sql-q16", subjectId: 4, subjectName: "Window Functions, Indexing & ACID Transactions", question: "What is the difference between `RANK()` and `DENSE_RANK()` window functions?", options: ["RANK() leaves gaps in ranking numbers after ties; DENSE_RANK() does not leave gaps", "DENSE_RANK() produces fractions while RANK() produces integers", "RANK() can only be used with partitions", "DENSE_RANK() is non-deterministic"], correctIndex: 0, explanation: "For values [100, 100, 90], RANK() gives 1, 1, 3; DENSE_RANK() gives 1, 1, 2." },
      { id: "sql-q17", subjectId: 4, subjectName: "Window Functions, Indexing & ACID Transactions", question: "What structure is most commonly used by relational database engines for primary key indexes?", options: ["B+ Tree", "Hash Table", "Trie", "Linked List"], correctIndex: 0, explanation: "B+ Trees maintain sorted order with high fan-out, making range queries and point lookups O(log N)." },
      { id: "sql-q18", subjectId: 4, subjectName: "Window Functions, Indexing & ACID Transactions", question: "What does the 'I' in ACID transaction properties stand for?", options: ["Isolation", "Integrity", "Indexing", "Idempotency"], correctIndex: 0, explanation: "ACID: Atomicity, Consistency, Isolation, Durability." },
      { id: "sql-q19", subjectId: 4, subjectName: "Window Functions, Indexing & ACID Transactions", question: "What phenomenon occurs when a transaction reads data that has been modified by another concurrent uncommitted transaction?", options: ["Dirty Read", "Phantom Read", "Non-Repeatable Read", "Deadlock"], correctIndex: 0, explanation: "A Dirty Read occurs at READ UNCOMMITTED isolation level when reading uncommitted changes." },
      { id: "sql-q20", subjectId: 4, subjectName: "Window Functions, Indexing & ACID Transactions", question: "What window clause partitions calculations per department and orders by hire date?", options: ["OVER (PARTITION BY department_id ORDER BY hire_date)", "GROUP BY department_id ORDER BY hire_date", "WINDOW BY department_id", "FILTER (WHERE department_id)"], correctIndex: 0, explanation: "OVER (PARTITION BY ... ORDER BY ...) defines the window frame specification." }
    ]
  },

  // ============================================================
  // 5. MACHINE LEARNING
  // ============================================================
  ml: {
    id: "codechef-ml",
    skill: "Machine Learning",
    category: "Technical",
    codechefCode: "CC-ML20",
    title: "CodeChef Machine Learning Foundations & Modeling Test",
    difficulty: "CodeChef 3★ (Intermediate)",
    durationMinutes: 20,
    totalQuestions: 20,
    passingScore: 60,
    benchmarkScore: 80,
    description: "Evaluates supervised models, unsupervised clustering, bias-variance tradeoff, regularization (L1/L2), and evaluation metrics.",
    subjects: [
      { id: 1, name: "Supervised Learning & Regression Models", questionRange: "Q1 - Q5" },
      { id: 2, name: "Classification & Tree-Based Ensembles", questionRange: "Q6 - Q10" },
      { id: 3, name: "Unsupervised Clustering & Dimensionality Reduction", questionRange: "Q11 - Q15" },
      { id: 4, name: "Overfitting, Regularization & Validation Metrics", questionRange: "Q16 - Q20" },
    ],
    codingProblem: {
      problemCode: "CC-ML301",
      title: "Calculate Mean Squared Error & Gradient Descent Step",
      timeLimit: "1.0s",
      memoryLimit: "256 MB",
      languages: ["Python 3", "PyPy 3"],
      description: "Given true target values `y_true` and predicted values `y_pred` as lists of floating numbers, compute the Mean Squared Error (MSE) and the gradient vector with respect to predictions.",
      inputFormat: "First line contains integer N. Second line contains N floats (y_true). Third line contains N floats (y_pred).",
      outputFormat: "Print the MSE rounded to 4 decimals, followed by space-separated gradients rounded to 4 decimals.",
      constraints: "1 <= N <= 10^5",
      sampleInput: "3\n1.0 2.0 3.0\n1.5 1.8 3.2",
      sampleOutput: "0.0967\n0.3333 -0.1333 0.1333",
      sampleExplanation: "MSE = ((1.5-1.0)^2 + (1.8-2.0)^2 + (3.2-3.0)^2) / 3 = 0.0967.",
      starterCode: `def solve(y_true, y_pred):\n    # Calculate MSE and gradients\n    n = len(y_true)\n    mse = sum((p - t)**2 for t, p in zip(y_true, y_pred)) / n\n    grads = [(2 * (p - t)) / n for t, p in zip(y_true, y_pred)]\n    return round(mse, 4), [round(g, 4) for g in grads]\n\nif __name__ == '__main__':\n    import sys\n    lines = sys.stdin.read().split()\n    if lines:\n        n = int(lines[0])\n        y_true = [float(x) for x in lines[1:1+n]]\n        y_pred = [float(x) for x in lines[1+n:1+2*n]]\n        mse, grads = solve(y_true, y_pred)\n        print(f"{mse:.4f}")\n        print(" ".join(f"{g:.4f}" for g in grads))`
    },
    questions: [
      { id: "ml-q1", subjectId: 1, subjectName: "Supervised Learning & Regression Models", question: "What loss function is conventionally minimized in Ordinary Least Squares (OLS) linear regression?", options: ["Mean Squared Error (MSE)", "Cross-Entropy Loss", "Hinge Loss", "Kullback-Leibler Divergence"], correctIndex: 0, explanation: "OLS minimizes the sum of squared residuals (MSE)." },
      { id: "ml-q2", subjectId: 1, subjectName: "Supervised Learning & Regression Models", question: "What is the activation function used in Logistic Regression to map outputs to probabilities between 0 and 1?", options: ["Sigmoid (Logistic Function)", "ReLU", "Softmax", "Leaky ReLU"], correctIndex: 0, explanation: "The sigmoid function sigma(z) = 1 / (1 + e^-z) outputs probabilities in [0, 1]." },
      { id: "ml-q3", subjectId: 1, subjectName: "Supervised Learning & Regression Models", question: "What does Gradient Descent optimize?", options: ["Model parameters (weights & biases) by stepping in direction of negative gradient of loss function", "The learning rate dynamically", "The test dataset size", "The feature matrix rank"], correctIndex: 0, explanation: "Gradient descent iteratively adjusts parameters in the opposite direction of the loss gradient." },
      { id: "ml-q4", subjectId: 1, subjectName: "Supervised Learning & Regression Models", question: "What happens if the learning rate in Gradient Descent is set excessively high?", options: ["The optimization may oscillate and diverge away from the minimum", "Training completes instantly in one step", "The model achieves zero bias", "Underfitting is guaranteed"], correctIndex: 0, explanation: "Too large learning rates cause overshooting and divergence." },
      { id: "ml-q5", subjectId: 1, subjectName: "Supervised Learning & Regression Models", question: "Which metric measures the proportion of variance in the dependent variable explained by linear regression?", options: ["R-squared (Coefficient of Determination)", "F1 Score", "Log-Loss", "ROC-AUC"], correctIndex: 0, explanation: "R^2 indicates the proportion of total variance explained by the model." },
      { id: "ml-q6", subjectId: 2, subjectName: "Classification & Tree-Based Ensembles", question: "What criterion is commonly used by decision trees to measure node impurity in classification?", options: ["Gini Impurity & Information Gain (Entropy)", "Mean Absolute Error", "Euclidean Distance", "Mahalanobis Distance"], correctIndex: 0, explanation: "CART uses Gini impurity, while ID3/C4.5 use Entropy and Information Gain." },
      { id: "ml-q7", subjectId: 2, subjectName: "Classification & Tree-Based Ensembles", question: "How does a Random Forest reduce model variance compared to individual decision trees?", options: ["By bagging (bootstrap aggregating) multiple de-correlated trees trained on random feature subsets", "By pruning nodes after training", "By scaling learning rate with exponential decay", "By chaining trees sequentially via residual boosting"], correctIndex: 0, explanation: "Random Forests combine bootstrap aggregation with random feature selection to de-correlate trees and lower variance." },
      { id: "ml-q8", subjectId: 2, subjectName: "Classification & Tree-Based Ensembles", question: "What is the primary difference between Bagging and Boosting?", options: ["Bagging trains independent models in parallel; Boosting trains models sequentially to correct predecessors' errors", "Bagging is for classification only; Boosting is for regression", "Bagging increases model complexity; Boosting decreases it", "Boosting ignores sample weights"], correctIndex: 0, explanation: "Bagging reduces variance via parallel averaging; Boosting reduces bias by iteratively focusing on misclassified instances." },
      { id: "ml-q9", subjectId: 2, subjectName: "Classification & Tree-Based Ensembles", question: "What does the kernel trick in Support Vector Machines (SVM) accomplish?", options: ["Projects data into a higher-dimensional space without explicitly computing coordinates there", "Performs fast batch gradient descent", "Computes decision tree depth", "Normalizes feature vectors to unit length"], correctIndex: 0, explanation: "Kernel trick computes inner products in high-dimensional feature spaces implicitly." },
      { id: "ml-q10", subjectId: 2, subjectName: "Classification & Tree-Based Ensembles", question: "In K-Nearest Neighbors (KNN), what effect does choosing a very small value of K (e.g. K = 1) have?", options: ["High variance and sensitivity to noise (overfitting)", "High bias and oversmoothed decision boundary (underfitting)", "Zero computational complexity at test time", "Eliminates need for feature scaling"], correctIndex: 0, explanation: "K=1 creates complex boundaries sensitive to every individual training point, leading to overfitting." },
      { id: "ml-q11", subjectId: 3, subjectName: "Unsupervised Clustering & Dimensionality Reduction", question: "How does the K-Means clustering algorithm assign data points to clusters?", options: ["Assigns points to the nearest cluster centroid based on Euclidean distance and iteratively updates centroids", "Builds a hierarchical dendrogram using linkage", "Calculates density gradients with epsilon radius", "Trains a multi-layer perceptron"], correctIndex: 0, explanation: "K-Means alternates between assigning points to the closest centroid and recomputing centroids." },
      { id: "ml-q12", subjectId: 3, subjectName: "Unsupervised Clustering & Dimensionality Reduction", question: "What does Principal Component Analysis (PCA) maximize when finding projection axes?", options: ["The variance of projected data points", "The clustering silhouette score", "The classification accuracy", "The entropy of features"], correctIndex: 0, explanation: "PCA seeks orthogonal axes (eigenvectors of covariance matrix) that maximize data variance." },
      { id: "ml-q13", subjectId: 3, subjectName: "Unsupervised Clustering & Dimensionality Reduction", question: "Which clustering algorithm can detect arbitrarily shaped clusters and identify noise points?", options: ["DBSCAN", "K-Means", "Gaussian Mixture Models", "Agglomerative Single Linkage"], correctIndex: 0, explanation: "DBSCAN clusters based on density and labels low-density points as noise/outliers." },
      { id: "ml-q14", subjectId: 3, subjectName: "Unsupervised Clustering & Dimensionality Reduction", question: "Why is feature scaling essential before running K-Means or PCA?", options: ["Features with larger scales dominate distance and variance calculations unfairly", "Distance metrics cannot compute on unscaled data", "It prevents division by zero in matrix inversion", "It reduces dataset dimensionality"], correctIndex: 0, explanation: "Unscaled features with large ranges disproportionately dominate Euclidean distance." },
      { id: "ml-q15", subjectId: 3, subjectName: "Unsupervised Clustering & Dimensionality Reduction", question: "What metric evaluates cluster cohesion versus separation without ground truth labels?", options: ["Silhouette Coefficient", "F1 Score", "Mean Squared Error", "Cross-Entropy"], correctIndex: 0, explanation: "Silhouette score ranges from -1 to +1 measuring how close a point is to its own cluster vs neighbor clusters." },
      { id: "ml-q16", subjectId: 4, subjectName: "Overfitting, Regularization & Validation Metrics", question: "What kind of penalty does L1 Regularization (Lasso) add to the loss function?", options: ["The sum of absolute values of weights (creates sparse models with feature selection)", "The sum of squared weights", "The maximum weight value", "The determinant of the covariance matrix"], correctIndex: 0, explanation: "L1 penalty (lambda * sum(|w|)) drives non-informative feature weights strictly to zero." },
      { id: "ml-q17", subjectId: 4, subjectName: "Overfitting, Regularization & Validation Metrics", question: "What does high training accuracy combined with low test/validation accuracy signify?", options: ["Overfitting (High Variance)", "Underfitting (High Bias)", "Optimal convergence", "Class imbalance artifact"], correctIndex: 0, explanation: "Good fit on training but poor generalization to unseen test data is the hallmark of overfitting." },
      { id: "ml-q18", subjectId: 4, subjectName: "Overfitting, Regularization & Validation Metrics", question: "When evaluating a rare cancer detection model, which metric is most critical to prioritize?", options: ["Recall (Sensitivity) to minimize false negatives", "Accuracy", "Precision", "Specificity"], correctIndex: 0, explanation: "Missing a malignant disease (False Negative) is fatal; maximizing Recall ensures nearly all cases are flagged." },
      { id: "ml-q19", subjectId: 4, subjectName: "Overfitting, Regularization & Validation Metrics", question: "What is the formula for F1-Score?", options: ["2 * (Precision * Recall) / (Precision + Recall)", "(Precision + Recall) / 2", "True Positives / (True Positives + False Positives)", "Accuracy * Precision"], correctIndex: 0, explanation: "F1 is the harmonic mean of Precision and Recall." },
      { id: "ml-q20", subjectId: 4, subjectName: "Overfitting, Regularization & Validation Metrics", question: "What does K-Fold Cross Validation prevent compared to a single train-test split?", options: ["Evaluation bias and variance resulting from an unrepresentative single split partition", "Underfitting", "Feature collinearity", "Data leakage during training"], correctIndex: 0, explanation: "K-Fold evaluates on K distinct test folds so every sample is used for both training and validation." }
    ]
  },

  // ============================================================
  // 6. DATA STRUCTURES & ALGORITHMS (DSA)
  // ============================================================
  dsa: {
    id: "codechef-dsa",
    skill: "Data Structures & Algorithms",
    category: "Technical",
    codechefCode: "CC-DSA20",
    title: "CodeChef Data Structures & Algorithmic Problem Solving Test",
    difficulty: "CodeChef 4★ (Advanced)",
    durationMinutes: 20,
    totalQuestions: 20,
    passingScore: 60,
    benchmarkScore: 80,
    description: "Evaluates arrays, linked lists, trees, graphs, dynamic programming, and asymptotic Big-O runtime analysis.",
    subjects: [
      { id: 1, name: "Arrays, Stacks, Queues & Hash Maps", questionRange: "Q1 - Q5" },
      { id: 2, name: "Linked Lists, Trees & Binary Search Trees", questionRange: "Q6 - Q10" },
      { id: 3, name: "Sorting, Searching & Divide-and-Conquer", questionRange: "Q11 - Q15" },
      { id: 4, name: "Graphs, Shortest Paths & Dynamic Programming", questionRange: "Q16 - Q20" },
    ],
    codingProblem: {
      problemCode: "CC-DSA201",
      title: "Two Sum Target Pair",
      timeLimit: "1.0s",
      memoryLimit: "256 MB",
      languages: ["C++", "Java", "Python 3"],
      description: "Given an array of integers `nums` and an integer `target`, return the 0-indexed indices of the two numbers such that they add up to `target`. Exactly one valid answer exists.",
      inputFormat: "First line contains N and target. Second line contains N integers.",
      outputFormat: "Print the two indices space-separated.",
      constraints: "2 <= N <= 10^5\n-10^9 <= nums[i] <= 10^9",
      sampleInput: "4 9\n2 7 11 15",
      sampleOutput: "0 1",
      sampleExplanation: "nums[0] + nums[1] == 2 + 7 == 9.",
      starterCode: `def twoSum(nums, target):\n    lookup = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in lookup:\n            return lookup[complement], i\n        lookup[num] = i\n    return -1, -1\n\nif __name__ == '__main__':\n    import sys\n    tokens = sys.stdin.read().split()\n    if tokens:\n        n, target = int(tokens[0]), int(tokens[1])\n        arr = [int(x) for x in tokens[2:2+n]]\n        i1, i2 = twoSum(arr, target)\n        print(f"{i1} {i2}")`
    },
    questions: [
      { id: "dsa-q1", subjectId: 1, subjectName: "Arrays, Stacks, Queues & Hash Maps", question: "What is the amortized time complexity of appending an element to a dynamic array (like Python list or C++ std::vector)?", options: ["O(1)", "O(N)", "O(log N)", "O(N^2)"], correctIndex: 0, explanation: "Doubling capacity when full distributes resizing cost over N operations, achieving O(1) amortized." },
      { id: "dsa-q2", subjectId: 1, subjectName: "Arrays, Stacks, Queues & Hash Maps", question: "Which data structure follows the LIFO (Last In First Out) principle?", options: ["Stack", "Queue", "Binary Heap", "Hash Table"], correctIndex: 0, explanation: "Stack adheres strictly to LIFO semantics (push and pop at top)." },
      { id: "dsa-q3", subjectId: 1, subjectName: "Arrays, Stacks, Queues & Hash Maps", question: "How does open addressing handle hash collisions in a hash table?", options: ["Probes subsequent slots within the array (linear, quadratic, or double hashing)", "Chains colliding keys into separate linked lists", "Discards old entries", "Resizes to a 2D matrix"], correctIndex: 0, explanation: "Open addressing searches for the next available bucket slot directly inside the hash table array." },
      { id: "dsa-q4", subjectId: 1, subjectName: "Arrays, Stacks, Queues & Hash Maps", question: "Which data structure can evaluate arithmetic postfix expressions in O(N) time?", options: ["Stack", "Queue", "Priority Queue", "Segment Tree"], correctIndex: 0, explanation: "Operands are pushed to a stack; operators pop operands, evaluate, and push the result back." },
      { id: "dsa-q5", subjectId: 1, subjectName: "Arrays, Stacks, Queues & Hash Maps", question: "What is the worst-case lookup time in a poorly designed hash map where all N keys hash to the same bucket?", options: ["O(N)", "O(1)", "O(log N)", "O(N log N)"], correctIndex: 0, explanation: "When all keys collide into a single bucket linked list, search degrades to linear traversal O(N)." },
      { id: "dsa-q6", subjectId: 2, subjectName: "Linked Lists, Trees & Binary Search Trees", question: "How do you detect a cycle in a singly linked list in O(N) time and O(1) auxiliary space?", options: ["Floyd's Tortoise and Hare algorithm (slow and fast pointers)", "Hash set storing visited node addresses", "Counting total nodes", "Reversing the list twice"], correctIndex: 0, explanation: "Floyd's algorithm uses two pointers moving at 1x and 2x speeds to detect cycles with O(1) space." },
      { id: "dsa-q7", subjectId: 2, subjectName: "Linked Lists, Trees & Binary Search Trees", question: "What property holds true for every node in a valid Binary Search Tree (BST)?", options: ["All keys in left subtree are smaller than node key, and all keys in right subtree are greater", "Every level must be completely filled except possibly the last", "Left and right subtrees must have identical heights", "The root must contain the median element"], correctIndex: 0, explanation: "BST invariant: left.val < node.val < right.val for all nodes." },
      { id: "dsa-q8", subjectId: 2, subjectName: "Linked Lists, Trees & Binary Search Trees", question: "Which tree traversal of a Binary Search Tree visits node keys in sorted ascending order?", options: ["In-order Traversal (Left, Root, Right)", "Pre-order Traversal", "Post-order Traversal", "Level-order Traversal"], correctIndex: 0, explanation: "In-order traversal visits left subtree, then current root, then right subtree, producing ascending order." },
      { id: "dsa-q9", subjectId: 2, subjectName: "Linked Lists, Trees & Binary Search Trees", question: "What is the height of a self-balancing AVL tree with N nodes?", options: ["O(log N)", "O(N)", "O(sqrt(N))", "O(N log N)"], correctIndex: 0, explanation: "AVL balance factor (|left_h - right_h| <= 1) guarantees worst-case height O(log N)." },
      { id: "dsa-q10", subjectId: 2, subjectName: "Linked Lists, Trees & Binary Search Trees", question: "What is the time complexity of deleting a node from a singly linked list given only a pointer to that node (not head)?", options: ["O(1) by copying next node's value and bypassing next node", "O(N)", "O(log N)", "Impossible without head"], correctIndex: 0, explanation: "Copy node->next->val into node, then set node->next = node->next->next in O(1)." },
      { id: "dsa-q11", subjectId: 3, subjectName: "Sorting, Searching & Divide-and-Conquer", question: "What is the worst-case time complexity of standard QuickSort with poor pivot selection?", options: ["O(N^2)", "O(N log N)", "O(N)", "O(log N)"], correctIndex: 0, explanation: "When pivot is consistently the maximum or minimum element, QuickSort partitions degrade to O(N^2)." },
      { id: "dsa-q12", subjectId: 3, subjectName: "Sorting, Searching & Divide-and-Conquer", question: "Which sorting algorithm is stable and guarantees O(N log N) worst-case time complexity?", options: ["MergeSort", "HeapSort", "QuickSort", "SelectionSort"], correctIndex: 0, explanation: "MergeSort guarantees O(N log N) and preserves the relative order of equal elements (stable)." },
      { id: "dsa-q13", subjectId: 3, subjectName: "Sorting, Searching & Divide-and-Conquer", question: "What is the precondition required to execute Binary Search on an array?", options: ["The array must be sorted", "The array must contain unique elements", "The array size must be a power of 2", "The elements must be positive integers"], correctIndex: 0, explanation: "Binary search eliminates half the search space at each step based on sorted order." },
      { id: "dsa-q14", subjectId: 3, subjectName: "Sorting, Searching & Divide-and-Conquer", question: "What is the time complexity of finding the K-th smallest element in an unsorted array of size N using QuickSelect (average case)?", options: ["O(N)", "O(N log N)", "O(K log N)", "O(N^2)"], correctIndex: 0, explanation: "QuickSelect only recurses into one partition: N + N/2 + N/4... = O(N) average time." },
      { id: "dsa-q15", subjectId: 3, subjectName: "Sorting, Searching & Divide-and-Conquer", question: "What is the space complexity of standard iterative HeapSort?", options: ["O(1) auxiliary space", "O(N)", "O(log N)", "O(N^2)"], correctIndex: 0, explanation: "HeapSort sorts in-place using the array itself as a binary heap, needing only O(1) extra space." },
      { id: "dsa-q16", subjectId: 4, subjectName: "Graphs, Shortest Paths & Dynamic Programming", question: "Which algorithm finds the shortest path from a single source to all vertices in a weighted graph with non-negative edge weights?", options: ["Dijkstra's Algorithm", "Bellman-Ford Algorithm", "Floyd-Warshall Algorithm", "Kruskal's Algorithm"], correctIndex: 0, explanation: "Dijkstra's algorithm using a min-heap finds single-source shortest paths in O((V + E) log V) with non-negative weights." },
      { id: "dsa-q17", subjectId: 4, subjectName: "Graphs, Shortest Paths & Dynamic Programming", question: "What two properties must a problem exhibit to be solvable by Dynamic Programming?", options: ["Optimal Substructure and Overlapping Subproblems", "Greedy Choice and Divide-and-Conquer", "Linearity and Monotonicity", "Markov Property and Memorylessness"], correctIndex: 0, explanation: "DP caches solutions to overlapping subproblems where global optima are composed of optimal subsolutions." },
      { id: "dsa-q18", subjectId: 4, subjectName: "Graphs, Shortest Paths & Dynamic Programming", question: "What is the time complexity of Breadth-First Search (BFS) on an adjacency list graph?", options: ["O(V + E)", "O(V * E)", "O(V^2)", "O(E log V)"], correctIndex: 0, explanation: "BFS visits each vertex once and traverses each edge once, taking O(V + E) time." },
      { id: "dsa-q19", subjectId: 4, subjectName: "Graphs, Shortest Paths & Dynamic Programming", question: "What is the time and space complexity of the 0/1 Knapsack problem with N items and capacity W using DP?", options: ["Time: O(N * W), Space: O(W)", "Time: O(2^N), Space: O(N)", "Time: O(N log W), Space: O(1)", "Time: O(N + W), Space: O(N * W)"], correctIndex: 0, explanation: "0/1 Knapsack evaluates state dp[w] = max(dp[w], val + dp[w - weight]) in O(N * W) pseudo-polynomial time and O(W) space." },
      { id: "dsa-q20", subjectId: 4, subjectName: "Graphs, Shortest Paths & Dynamic Programming", question: "Which algorithm is used to detect cycle in a directed graph?", options: ["DFS with recursion stack tracking (3 colors: unvisited, visiting, visited)", "Dijkstra's algorithm", "Prim's algorithm", "Binary search"], correctIndex: 0, explanation: "A back-edge encountered during DFS traversal to an ancestor currently in the recursion stack detects a directed cycle." }
    ]
  },

  // ============================================================
  // 7. WEB DEVELOPMENT
  // ============================================================
  webdev: {
    id: "codechef-webdev",
    skill: "React & Modern Frontend",
    category: "Technical",
    codechefCode: "CC-WEB20",
    title: "CodeChef Full-Stack & Modern Web Development Test",
    difficulty: "CodeChef 3★ (Intermediate)",
    durationMinutes: 20,
    totalQuestions: 20,
    passingScore: 60,
    benchmarkScore: 80,
    description: "Evaluates HTML5/CSS3 architectures, JavaScript ES6+ event loops, React custom hooks, and REST APIs.",
    subjects: [
      { id: 1, name: "HTML5 Semantics & Modern CSS Layouts", questionRange: "Q1 - Q5" },
      { id: 2, name: "JavaScript ES6+, Promises & Event Loop", questionRange: "Q6 - Q10" },
      { id: 3, name: "React Components, State & Hooks", questionRange: "Q11 - Q15" },
      { id: 4, name: "REST APIs, Web Security & Performance", questionRange: "Q16 - Q20" },
    ],
    codingProblem: {
      problemCode: "CC-WEB201",
      title: "Implement Debounce with Immediate Execution",
      timeLimit: "1.0s",
      memoryLimit: "256 MB",
      languages: ["JavaScript (Node.js)", "TypeScript"],
      description: "Implement a debounce higher-order utility function that delays invoking the target function until after `wait` milliseconds. If `immediate` is true, invoke on the leading edge instead of trailing.",
      inputFormat: "Sequence of call events and millisecond delays.",
      outputFormat: "Array of actual invoked execution timestamps and outputs.",
      constraints: "wait >= 0, calls <= 10^4",
      sampleInput: "wait: 50ms, calls: [0ms, 20ms, 40ms, 120ms]",
      sampleOutput: "executed: [90ms, 170ms]",
      sampleExplanation: "Calls at 0ms and 20ms are debounced by the call at 40ms which fires at 90ms. Call at 120ms fires at 170ms.",
      starterCode: `function debounce(func, wait, immediate) {\n  let timeout = null;\n  return function(...args) {\n    const context = this;\n    const callNow = immediate && !timeout;\n    clearTimeout(timeout);\n    timeout = setTimeout(() => {\n      timeout = null;\n      if (!immediate) func.apply(context, args);\n    }, wait);\n    if (callNow) func.apply(context, args);\n  };\n}\n\nmodule.exports = { debounce };`
    },
    questions: [
      { id: "wb-q1", subjectId: 1, subjectName: "HTML5 Semantics & Modern CSS Layouts", question: "Which CSS layout model is designed specifically for 2-dimensional layouts (rows and columns simultaneously)?", options: ["CSS Grid", "Flexbox", "Float", "Inline-Block"], correctIndex: 0, explanation: "CSS Grid is a 2D layout system, whereas Flexbox is primarily a 1-dimensional system." },
      { id: "wb-q2", subjectId: 1, subjectName: "HTML5 Semantics & Modern CSS Layouts", question: "What does `box-sizing: border-box` do in CSS?", options: ["Includes padding and border in the element's total specified width and height", "Adds a drop shadow to the border", "Excludes padding from dimensions", "Forces the element to clear floating siblings"], correctIndex: 0, explanation: "border-box ensures width and height encompass content, padding, and borders." },
      { id: "wb-q3", subjectId: 1, subjectName: "HTML5 Semantics & Modern CSS Layouts", question: "Which semantic HTML5 element represents standalone, self-contained syndicated content?", options: ["<article>", "<section>", "<div>", "<aside>"], correctIndex: 0, explanation: "<article> represents independent content like blog posts, forum replies, or product cards." },
      { id: "wb-q4", subjectId: 1, subjectName: "HTML5 Semantics & Modern CSS Layouts", question: "What is the CSS specificity hierarchy from highest to lowest?", options: ["!important > Inline styles > IDs > Classes/Attributes/Pseudo-classes > Elements", "IDs > Elements > Classes > Inline", "Classes > IDs > Elements", "Inline > Elements > Classes"], correctIndex: 0, explanation: "Inline (1,0,0,0) > ID (0,1,0,0) > Class (0,0,1,0) > Element (0,0,0,1)." },
      { id: "wb-q5", subjectId: 1, subjectName: "HTML5 Semantics & Modern CSS Layouts", question: "What does the `rem` unit represent in CSS?", options: ["Relative to the font-size of the root `<html>` element", "Relative to the immediate parent element font-size", "Responsive viewport height", "Pixels multiplied by device pixel ratio"], correctIndex: 0, explanation: "rem (root em) is relative to the root html font-size (default 16px)." },
      { id: "wb-q6", subjectId: 2, subjectName: "JavaScript ES6+, Promises & Event Loop", question: "What does `typeof null` evaluate to in JavaScript due to legacy implementation?", options: ["'object'", "'null'", "'undefined'", "'boolean'"], correctIndex: 0, explanation: "In early JS implementation, values had type tags, and 0 was assigned to object; null was null pointer (0)." },
      { id: "wb-q7", subjectId: 2, subjectName: "JavaScript ES6+, Promises & Event Loop", question: "What is the priority order of execution in the JavaScript Event Loop?", options: ["Call Stack -> Microtask Queue (Promises) -> Macrotask Queue (setTimeout/setInterval)", "Macrotasks execute before Microtasks", "setTimeout executes synchronously", "Call Stack -> Web APIs -> setTimeout"], correctIndex: 0, explanation: "Microtasks (Promise.then, queueMicrotask) drain completely after each call stack tick before the next macrotask." },
      { id: "wb-q8", subjectId: 2, subjectName: "JavaScript ES6+, Promises & Event Loop", question: "What is a closure in JavaScript?", options: ["A function bundled together with references to its surrounding lexical environment", "A method that closes network connections", "An immediately invoked function expression that cannot return", "A sealed object that cannot receive new properties"], correctIndex: 0, explanation: "Closures give an inner function access to an outer function's scope even after the outer function has returned." },
      { id: "wb-q9", subjectId: 2, subjectName: "JavaScript ES6+, Promises & Event Loop", question: "What is the output of `console.log(1 + '2' + 3)` in JavaScript?", options: ["'123'", "6", "15", "NaN"], correctIndex: 0, explanation: "1 + '2' converts 1 to string '12', then '12' + 3 results in '123' via string concatenation." },
      { id: "wb-q10", subjectId: 2, subjectName: "JavaScript ES6+, Promises & Event Loop", question: "How does `let` and `const` differ from `var` regarding scope and hoisting?", options: ["`let` and `const` are block-scoped and exist in a Temporal Dead Zone before declaration; `var` is function-scoped", "`var` is block-scoped; `let` is global", "`const` variables can be redeclared in the same block", "`let` does not hoist at all in compiler"], correctIndex: 0, explanation: "let and const obey block scope and throw ReferenceError if accessed in TDZ prior to declaration." },
      { id: "wb-q11", subjectId: 3, subjectName: "React Components, State & Hooks", question: "What hook is used to perform side effects (data fetching, subscriptions, DOM mutations) in React?", options: ["useEffect", "useState", "useMemo", "useRef"], correctIndex: 0, explanation: "useEffect tells React to run side effect functions after rendering." },
      { id: "wb-q12", subjectId: 3, subjectName: "React Components, State & Hooks", question: "Why must React keys passed to lists be unique and stable across re-renders?", options: ["Keys enable the Virtual DOM reconciliation algorithm to identify which items have changed, added, or removed", "Keys assign CSS z-index priority", "Keys prevent network re-fetching", "Keys convert functional components into class components"], correctIndex: 0, explanation: "Reconciliation uses keys to match existing elements and minimize unnecessary DOM node re-creations." },
      { id: "wb-q13", subjectId: 3, subjectName: "React Components, State & Hooks", question: "What does the `useMemo` hook cache?", options: ["The result of a calculation between re-renders when dependencies have not changed", "DOM node references", "Component constructor instances", "Redux dispatch actions"], correctIndex: 0, explanation: "useMemo(() => computeValue(a, b), [a, b]) memoizes expensive computational return values." },
      { id: "wb-q14", subjectId: 3, subjectName: "React Components, State & Hooks", question: "What happens when you mutate React state directly like `state.count = 5` instead of using `setState`?", options: ["React does not detect the change and will not trigger a component re-render", "React throws an uncaught TypeError", "The DOM updates immediately", "The browser forces a full page reload"], correctIndex: 0, explanation: "React relies on referential inequality checks in setState to schedule component re-renders." },
      { id: "wb-q15", subjectId: 3, subjectName: "React Components, State & Hooks", question: "What is the purpose of `useRef` in React?", options: ["To hold a mutable value that persists across re-renders without triggering a re-render when changed", "To execute side effects synchronously before browser repaint", "To create a global Redux store slice", "To memoize child component trees"], correctIndex: 0, explanation: "useRef returns a persistent mutable ref object (.current) that does not trigger re-renders on mutation." },
      { id: "wb-q16", subjectId: 4, subjectName: "REST APIs, Web Security & Performance", question: "Which HTTP status code signifies that a resource was successfully created on the server?", options: ["201 Created", "200 OK", "204 No Content", "301 Moved Permanently"], correctIndex: 0, explanation: "201 Created is the standard REST response when a POST request creates a new entity." },
      { id: "wb-q17", subjectId: 4, subjectName: "REST APIs, Web Security & Performance", question: "What security header helps protect websites from Cross-Site Scripting (XSS) attacks?", options: ["Content-Security-Policy (CSP)", "Access-Control-Allow-Origin", "Cache-Control", "X-Powered-By"], correctIndex: 0, explanation: "CSP restricts which domains can load scripts, images, and styles, preventing malicious inline execution." },
      { id: "wb-q18", subjectId: 4, subjectName: "REST APIs, Web Security & Performance", question: "What does CORS (Cross-Origin Resource Sharing) control in browsers?", options: ["Permits or restricts web pages from making HTTP requests to a different domain/port than their own origin", "Encrypts client-server SSL traffic", "Manages local browser cookie expiration", "Minifies JavaScript bundles dynamically"], correctIndex: 0, explanation: "CORS is a browser security mechanism that uses HTTP headers to govern cross-origin access." },
      { id: "wb-q19", subjectId: 4, subjectName: "REST APIs, Web Security & Performance", question: "What HTTP method is considered idempotent in REST architectures?", options: ["PUT and DELETE", "POST", "PATCH (when appending)", "None of the above"], correctIndex: 0, explanation: "GET, PUT, and DELETE are idempotent (calling them N times produces the same server state as calling once)." },
      { id: "wb-q20", subjectId: 4, subjectName: "REST APIs, Web Security & Performance", question: "What frontend performance technique delays loading offscreen images until the user scrolls near them?", options: ["Lazy Loading", "Tree Shaking", "Code Splitting", "Hydration"], correctIndex: 0, explanation: "Lazy loading (loading='lazy') defers asset downloads until elements approach the viewport." }
    ]
  },

  // ============================================================
  // 8. CLOUD COMPUTING
  // ============================================================
  cloud: {
    id: "codechef-cloud",
    skill: "Cloud Computing (AWS/GCP)",
    category: "Technical",
    codechefCode: "CC-CLOUD20",
    title: "CodeChef Cloud Infrastructure & DevOps Test",
    difficulty: "CodeChef 3★ (Intermediate)",
    durationMinutes: 20,
    totalQuestions: 20,
    passingScore: 60,
    benchmarkScore: 80,
    description: "Evaluates cloud service models (IaaS/PaaS/SaaS), AWS/GCP services, IAM policies, Docker containers, and high availability.",
    subjects: [
      { id: 1, name: "Cloud Models, Virtualization & Regions", questionRange: "Q1 - Q5" },
      { id: 2, name: "Compute, Storage & Object Stores (EC2/S3)", questionRange: "Q6 - Q10" },
      { id: 3, name: "Networking, VPC, Security Groups & IAM", questionRange: "Q11 - Q15" },
      { id: 4, name: "Containers, Serverless & High Availability", questionRange: "Q16 - Q20" },
    ],
    codingProblem: {
      problemCode: "CC-CLD401",
      title: "Multi-Zone Server Capacity & Cost Balancer",
      timeLimit: "1.0s",
      memoryLimit: "256 MB",
      languages: ["Python 3", "PyPy 3"],
      description: "Given a list of availability zones with CPU capacity and a sequence of incoming workload requests, allocate each request to the zone with lowest utilization ratio while ensuring high availability (no single zone exceeds 85% capacity).",
      inputFormat: "First line contains number of zones Z. Next Z lines contain zone names and capacities. Last line contains space-separated request loads.",
      outputFormat: "Print zone allocations and the peak utilization percentage.",
      constraints: "1 <= Z <= 50, requests <= 10^4",
      sampleInput: "3\nus-east-1a 100\nus-east-1b 100\nus-east-1c 100\n30 40 25 35",
      sampleOutput: "Allocations: us-east-1a, us-east-1b, us-east-1c, us-east-1a\nPeak: 65%",
      sampleExplanation: "Workloads are dynamically distributed across zones to avoid hot spots.",
      starterCode: `def balance_load(zones, requests):\n    # Implement least-loaded zone dispatcher\n    allocations = []\n    for req in requests:\n        zones.sort(key=lambda z: z['current_load'] / z['capacity'])\n        chosen = zones[0]\n        chosen['current_load'] += req\n        allocations.append(chosen['name'])\n    peak = max(z['current_load'] / z['capacity'] for z in zones) * 100\n    return allocations, f"{peak:.0f}%"\n\nif __name__ == '__main__':\n    zones = [{'name': 'us-east-1a', 'capacity': 100, 'current_load': 0},\n             {'name': 'us-east-1b', 'capacity': 100, 'current_load': 0},\n             {'name': 'us-east-1c', 'capacity': 100, 'current_load': 0}]\n    allocs, peak = balance_load(zones, [30, 40, 25, 35])\n    print(f"Allocations: {', '.join(allocs)}")\n    print(f"Peak: {peak}")`
    },
    questions: [
      { id: "cl-q1", subjectId: 1, subjectName: "Cloud Models, Virtualization & Regions", question: "Which cloud service model provides virtual machines, operating systems, and raw networking hardware control?", options: ["IaaS (Infrastructure as a Service)", "PaaS (Platform as a Service)", "SaaS (Software as a Service)", "FaaS (Function as a Service)"], correctIndex: 0, explanation: "IaaS (e.g. AWS EC2, GCP Compute Engine) gives full control over compute instances and OS." },
      { id: "cl-q2", subjectId: 1, subjectName: "Cloud Models, Virtualization & Regions", question: "What is an AWS Availability Zone (AZ)?", options: ["One or more discrete data centers with redundant power, networking, and connectivity in a Region", "A geographic continent", "A edge cache location for CloudFront", "A software subnet definition"], correctIndex: 0, explanation: "An AZ consists of isolated physical data centers within a geographical Region connected by low-latency links." },
      { id: "cl-q3", subjectId: 1, subjectName: "Cloud Models, Virtualization & Regions", question: "What cloud principle allows infrastructure capacity to dynamically grow and shrink matching real-time user traffic?", options: ["Elasticity", "High Availability", "Fault Tolerance", "Durability"], correctIndex: 0, explanation: "Elasticity automatically scales compute resources up or down according to workload demand." },
      { id: "cl-q4", subjectId: 1, subjectName: "Cloud Models, Virtualization & Regions", question: "In the Cloud Shared Responsibility Model, what is the customer responsible for under IaaS?", options: ["Operating system patching, application code, data encryption, and network firewalls", "Physical server hardware maintenance", "Data center perimeter security", "HVAC cooling systems"], correctIndex: 0, explanation: "Under IaaS, the cloud provider manages physical hardware; the customer manages OS, software, and data." },
      { id: "cl-q5", subjectId: 1, subjectName: "Cloud Models, Virtualization & Regions", question: "What is an Edge Location in content delivery networks like AWS CloudFront?", options: ["A site located close to end users used to cache content and reduce latency", "A central backup data center", "A VPC private subnet", "A disaster recovery cold site"], correctIndex: 0, explanation: "Edge Locations cache static and dynamic assets near end users for rapid content delivery." },
      { id: "cl-q6", subjectId: 2, subjectName: "Compute, Storage & Object Stores (EC2/S3)", question: "What AWS service offers scalable object storage with 99.999999999% (11 9s) of durability?", options: ["Amazon S3", "Amazon EBS", "Amazon EFS", "AWS Snowball"], correctIndex: 0, explanation: "Amazon Simple Storage Service (S3) provides 11 9s durability across multiple AZs." },
      { id: "cl-q7", subjectId: 2, subjectName: "Compute, Storage & Object Stores (EC2/S3)", question: "What type of storage is Amazon Elastic Block Store (EBS)?", options: ["Block-level storage volume attached to a single EC2 instance", "Object storage accessed via HTTP REST endpoints", "Shared NFS network file system", "In-memory key-value cache"], correctIndex: 0, explanation: "EBS provides raw block-level volumes that behave like hard drives for EC2 instances." },
      { id: "cl-q8", subjectId: 2, subjectName: "Compute, Storage & Object Stores (EC2/S3)", question: "Which EC2 pricing model allows purchasing unused compute capacity at up to 90% discount, with risk of interruption?", options: ["Spot Instances", "On-Demand Instances", "Reserved Instances", "Dedicated Hosts"], correctIndex: 0, explanation: "Spot Instances offer massive cost savings on spare AWS capacity for fault-tolerant workloads." },
      { id: "cl-q9", subjectId: 2, subjectName: "Compute, Storage & Object Stores (EC2/S3)", question: "What is an AMI (Amazon Machine Image)?", options: ["A pre-configured template containing operating system, software packages, and permissions to launch an EC2 instance", "A container registry", "A DNS routing policy", "A database snapshot"], correctIndex: 0, explanation: "AMIs package boot volumes containing OS and software to launch virtual servers." },
      { id: "cl-q10", subjectId: 2, subjectName: "Compute, Storage & Object Stores (EC2/S3)", question: "Which S3 storage class is best suited for archiving compliance data accessed less than once a year?", options: ["S3 Glacier Flexible Deep Archive", "S3 Standard", "S3 Intelligent-Tiering", "S3 Express One Zone"], correctIndex: 0, explanation: "Glacier Deep Archive provides the lowest-cost storage for long-term archival retrieval." },
      { id: "cl-q11", subjectId: 3, subjectName: "Networking, VPC, Security Groups & IAM", question: "What security feature in AWS acts as a stateful virtual firewall for EC2 instances?", options: ["Security Group", "Network ACL (NACL)", "NAT Gateway", "Route Table"], correctIndex: 0, explanation: "Security Groups are stateful (inbound allowed rules automatically allow outbound responses)." },
      { id: "cl-q12", subjectId: 3, subjectName: "Networking, VPC, Security Groups & IAM", question: "What AWS IAM concept grants temporary credentials to services and applications rather than static API keys?", options: ["IAM Roles", "IAM Users", "IAM Root Account", "IAM MFA Tokens"], correctIndex: 0, explanation: "IAM Roles provide secure, auto-rotating short-term credentials to AWS resources." },
      { id: "cl-q13", subjectId: 3, subjectName: "Networking, VPC, Security Groups & IAM", question: "What allows instances in a private subnet to initiate outbound internet traffic while blocking inbound connections?", options: ["NAT Gateway", "Internet Gateway", "VPC Peering", "Customer Gateway"], correctIndex: 0, explanation: "NAT (Network Address Translation) Gateways enable outbound requests while preventing unsolicited inbound traffic." },
      { id: "cl-q14", subjectId: 3, subjectName: "Networking, VPC, Security Groups & IAM", question: "What is the principle of least privilege in IAM security?", options: ["Granting users and services only the minimum permissions necessary to perform their required tasks", "Giving admin access to all engineering team members", "Using simple alphanumeric passwords", "Allowing all inbound IP traffic on port 22"], correctIndex: 0, explanation: "Least privilege minimizes security attack surface by denying all unneeded access." },
      { id: "cl-q15", subjectId: 3, subjectName: "Networking, VPC, Security Groups & IAM", question: "What is a CIDR block in VPC subnet design (e.g., `10.0.0.0/16`)?", options: ["Classless Inter-Domain Routing notation specifying the IP address range available in the network", "A cryptographic encryption key", "A database shard identifier", "An SSL certificate fingerprint"], correctIndex: 0, explanation: "CIDR notation specifies IP ranges and netmasks for VPCs and subnets." },
      { id: "cl-q16", subjectId: 4, subjectName: "Containers, Serverless & High Availability", question: "What serverless compute service runs code in response to events without provisioning servers in AWS?", options: ["AWS Lambda", "Amazon EC2", "AWS Elastic Beanstalk", "Amazon Lightsail"], correctIndex: 0, explanation: "AWS Lambda executes code functions on-demand with automatic scaling and zero idle costs." },
      { id: "cl-q17", subjectId: 4, subjectName: "Containers, Serverless & High Availability", question: "What does Docker containerization provide compared to traditional virtual machines?", options: ["Lightweight process isolation sharing the host OS kernel with near-instant startup", "Hardware-level hypervisor virtualization", "Emulation of different CPU instruction sets", "Unlimited free cloud compute hours"], correctIndex: 0, explanation: "Containers share the host kernel and isolate user space, booting in milliseconds with tiny footprints." },
      { id: "cl-q18", subjectId: 4, subjectName: "Containers, Serverless & High Availability", question: "What is the primary role of Kubernetes (K8s) in cloud native architectures?", options: ["Automated container orchestration: scaling, self-healing, rolling updates, and service discovery", "Writing application frontend templates", "Replacing relational databases", "Managing physical router switches"], correctIndex: 0, explanation: "Kubernetes coordinates deployment, scaling, and recovery across fleets of containerized applications." },
      { id: "cl-q19", subjectId: 4, subjectName: "Containers, Serverless & High Availability", question: "What AWS service automatically distributes incoming application traffic across multiple targets in different AZs?", options: ["Elastic Load Balancer (ALB/NLB)", "Route 53 Hosted Zone", "Auto Scaling Group", "CloudFront Distribution"], correctIndex: 0, explanation: "ELBs balance traffic across multiple healthy targets across multiple availability zones." },
      { id: "cl-q20", subjectId: 4, subjectName: "Containers, Serverless & High Availability", question: "What does Infrastructure as Code (IaC) tools like Terraform and AWS CloudFormation enable?", options: ["Provisioning and version-controlling cloud infrastructure using declarative configuration files", "Automating JavaScript code formatting", "Running unit tests inside CI/CD pipelines", "Replacing Linux shell terminals"], correctIndex: 0, explanation: "IaC models infrastructure in code files, enabling repeatable, automated, and audited deployments." }
    ]
  },

  // ============================================================
  // 9. COMMUNICATION (PROFESSIONAL)
  // ============================================================
  communication: {
    id: "codechef-comm",
    skill: "Communication & Presentation",
    category: "Professional",
    codechefCode: "CC-COMM20",
    title: "CodeChef Technical Storytelling & Professional Communication Test",
    difficulty: "All Levels (Situational Judgment)",
    durationMinutes: 20,
    totalQuestions: 20,
    passingScore: 60,
    benchmarkScore: 80,
    description: "Evaluates stakeholder framing, active listening, executive communication, technical presentation, and written clarity.",
    subjects: [
      { id: 1, name: "Stakeholder Framing & Executive Summaries", questionRange: "Q1 - Q5" },
      { id: 2, name: "Active Listening, Inquiry & Empathy", questionRange: "Q6 - Q10" },
      { id: 3, name: "Technical Presentation & Data Storytelling", questionRange: "Q11 - Q15" },
      { id: 4, name: "Constructive Feedback & Written Documentation", questionRange: "Q16 - Q20" },
    ],
    questions: [
      { id: "cm-q1", subjectId: 1, subjectName: "Stakeholder Framing & Executive Summaries", question: "When presenting a database migration delay to non-technical business executives, what is the most effective approach?", options: ["Lead with business impact (risk mitigation, uptime) and actionable revised delivery timelines rather than low-level technical jargon", "Explain internal B-Tree index locking algorithms in detail", "Avoid mentioning the delay until the migration is completed", "Blame the legacy infrastructure vendors"], correctIndex: 0, explanation: "Executive communication focuses on business risk, outcomes, timeline impact, and next steps." },
      { id: "cm-q2", subjectId: 1, subjectName: "Stakeholder Framing & Executive Summaries", question: "What principle states that communications should lead with the main conclusion/recommendation first?", options: ["The Minto Pyramid Principle (BLUF: Bottom Line Up Front)", "The Fibonacci Sequence", "Pareto 80/20 Rule", "The Waterfall Methodology"], correctIndex: 0, explanation: "The Pyramid Principle structures communication with the core answer first, followed by supporting arguments." },
      { id: "cm-q3", subjectId: 1, subjectName: "Stakeholder Framing & Executive Summaries", question: "When writing a project status email to senior leadership, what is the ideal structure?", options: ["1-sentence status (Green/Yellow/Red), key highlights, major risks/blockers, and exact decisions required", "A 10-page unformatted dump of git commit logs", "A forwarded chain of 30 internal Slack messages", "Only good news with zero mention of current technical debt"], correctIndex: 0, explanation: "Clear executive updates provide RAG status, highlights, blockers, and clear asks." },
      { id: "cm-q4", subjectId: 1, subjectName: "Stakeholder Framing & Executive Summaries", question: "What should you do if an executive asks a critical technical question you do not currently know the answer to?", options: ["Acknowledge transparently that you don't have the exact figure, and commit to a specific timeframe to follow up with verified data", "Guess an approximate number confidently", "Deflect by changing the topic to an unrelated feature", "Remain silent until someone else answers"], correctIndex: 0, explanation: "Intellectual honesty builds trust; acknowledge and provide a crisp follow-up deadline." },
      { id: "cm-q5", subjectId: 1, subjectName: "Stakeholder Framing & Executive Summaries", question: "How should technical metrics (like p99 latency or cache hit rates) be framed for product managers?", options: ["Translate them into customer experience metrics (e.g. 'Users experience 400ms faster checkout')", "Only share the raw mathematical formulas", "Insist that business metrics are irrelevant to engineering", "Tell them to check the Grafana dashboard themselves"], correctIndex: 0, explanation: "Effective technical storytelling bridges telemetry metrics with user and business impact." },
      { id: "cm-q6", subjectId: 2, subjectName: "Active Listening, Inquiry & Empathy", question: "What is an active listening technique to verify you accurately understood a colleague's requirement?", options: ["Paraphrase their core request back in your own words: 'What I am hearing is... is that correct?'", "Interrupt them as soon as you think of a code solution", "Nod silently while typing an email", "Assume you know what they meant without asking clarifying questions"], correctIndex: 0, explanation: "Paraphrasing confirms mutual alignment before engineering work begins." },
      { id: "cm-q7", subjectId: 2, subjectName: "Active Listening, Inquiry & Empathy", question: "What type of questions encourage comprehensive explanations during requirements gathering?", options: ["Open-ended questions (starting with 'How', 'What', or 'Help me understand...')", "Closed yes/no questions", "Leading rhetorical questions", "Aggressive accusatory questions"], correctIndex: 0, explanation: "Open-ended questions encourage stakeholders to elaborate on context and edge cases." },
      { id: "cm-q8", subjectId: 2, subjectName: "Active Listening, Inquiry & Empathy", question: "In a cross-cultural engineering team, what helps avoid miscommunication during asynchronous chats?", options: ["Clear, explicit written assumptions, bulleted action items, and avoiding regional slang or idioms", "Relying strictly on sarcasm", "Using single-word replies", "Refusing to document decisions in writing"], correctIndex: 0, explanation: "Explicit, concise, idiom-free writing ensures clarity across global timezones." },
      { id: "cm-q9", subjectId: 2, subjectName: "Active Listening, Inquiry & Empathy", question: "When a junior developer expresses anxiety about deploying their first production change, how should a senior engineer respond?", options: ["Validate their concern, walk through the safety guardrails/rollback plan together, and offer to pair-deploy", "Tell them everyone makes mistakes and walk away", "Mock their apprehension in the team channel", "Remove their deployment permissions permanently"], correctIndex: 0, explanation: "Empathetic mentorship provides psychological safety and structured procedural support." },
      { id: "cm-q10", subjectId: 2, subjectName: "Active Listening, Inquiry & Empathy", question: "What body language communicates engagement during in-person or video presentations?", options: ["Maintaining regular eye contact, an open posture, and attentive nodding", "Looking down at a smartphone continuously", "Crossing arms and sighing loudly", "Turning off the camera with no explanation"], correctIndex: 0, explanation: "Attentive posture and eye contact signal presence and active engagement." },
      { id: "cm-q11", subjectId: 3, subjectName: "Technical Presentation & Data Storytelling", question: "When presenting architectural diagrams to an engineering committee, what is the best practice?", options: ["Use standardized notation (e.g. C4 Model / UML), clear component boundaries, and walk through data flow sequentially", "Put 100 microservices on one slide in tiny 6pt font without labels", "Use 15 contrasting bright neon colors with no legend", "Skip the architecture and show 2,000 lines of raw assembly code"], correctIndex: 0, explanation: "Layered visual models (like C4) establish clarity from system context down to component details." },
      { id: "cm-q12", subjectId: 3, subjectName: "Technical Presentation & Data Storytelling", question: "How should technical slides be formatted to avoid overwhelming an audience?", options: ["One core takeaway per slide, high-contrast visual aids, and minimal concise bullet points", "Fill every square inch with dense text paragraphs to read verbatim", "Animate every word with bouncing transitions", "Use unreadable dark gray text on black backgrounds"], correctIndex: 0, explanation: "Cognitive load theory recommends 1 clear idea per slide with supporting visual cues." },
      { id: "cm-q13", subjectId: 3, subjectName: "Technical Presentation & Data Storytelling", question: "What is an effective way to handle hostile or skeptical questions during a technical defense?", options: ["Stay calm, acknowledge the validity of their concern, address the technical facts, and invite offline deep-dive if complex", "Argue aggressively and insult their intelligence", "Refuse to take further questions", "End the presentation abruptly"], correctIndex: 0, explanation: "Composure and fact-based answers de-escalate tension and preserve professional credibility." },
      { id: "cm-q14", subjectId: 3, subjectName: "Technical Presentation & Data Storytelling", question: "Why is a live demo often preceded by a recorded backup video during technical conference talks?", options: ["To mitigate conference Wi-Fi failures and guarantee a working demonstration can be shown", "Because live demos are forbidden", "To avoid answering technical questions", "To leave early"], correctIndex: 0, explanation: "Contingency planning (having recorded backup assets) is standard professional risk mitigation." },
      { id: "cm-q15", subjectId: 3, subjectName: "Technical Presentation & Data Storytelling", question: "What should conclude every formal technical presentation?", options: ["A clear summary of key takeaways, specific action items/owners, and an open Q&A session", "An abrupt slide with 'The End' and no next steps", "A complaint about project deadlines", "A pitch for personal social media followers"], correctIndex: 0, explanation: "Presentations should close with decisive takeaways and clear ownership of action items." },
      { id: "cm-q16", subjectId: 4, subjectName: "Constructive Feedback & Written Documentation", question: "What distinguishes constructive code review feedback from negative feedback?", options: ["It focuses objectively on the code behavior and architectural tradeoffs rather than attacking the author's ability", "It uses harsh all-caps sentences like 'THIS CODE IS TERRIBLE'", "It approves PRs blindly without reading them", "It demands that all code be rewritten in the reviewer's personal style"], correctIndex: 0, explanation: "Constructive feedback critiques the code objectively with explanations of 'why'." },
      { id: "cm-q17", subjectId: 4, subjectName: "Constructive Feedback & Written Documentation", question: "What is the SBI (Situation-Behavior-Impact) feedback model?", options: ["Describing the specific Situation, the observable Behavior, and the concrete Impact it had", "A software architecture design pattern", "A government procurement protocol", "A psychological personality matrix"], correctIndex: 0, explanation: "SBI provides structured, non-judgmental behavioral feedback." },
      { id: "cm-q18", subjectId: 4, subjectName: "Constructive Feedback & Written Documentation", question: "What makes technical documentation (like API docs or READMEs) truly high quality?", options: ["Clear quickstart instructions, realistic code examples, error response specifications, and accurate changelogs", "1,000 pages of theoretical philosophy with zero code snippets", "Outdated documentation that contradicts the current API", "Undocumented environment variables"], correctIndex: 0, explanation: "Great documentation enables rapid onboarding through practical examples and accurate specs." },
      { id: "cm-q19", subjectId: 4, subjectName: "Constructive Feedback & Written Documentation", question: "How should an engineer document a major system architectural decision for future teammates?", options: ["Write an Architecture Decision Record (ADR) detailing Context, Decision, Consequences, and Alternatives considered", "Keep it in their private head and tell no one", "Write a cryptic 3-word commit message", "Delete past architectural records"], correctIndex: 0, explanation: "ADRs capture institutional memory, explaining why decisions were made and trade-offs weighed." },
      { id: "cm-q20", subjectId: 4, subjectName: "Constructive Feedback & Written Documentation", question: "When receiving critical feedback on an RFC design document, what is the best mindset?", options: ["Growth mindset: view critiques as opportunities to identify blind spots and harden the system before production", "Personal attack mindset: argue defensively against every point", "Ignore all comments and merge the PR immediately", "Complain to HR about colleagues giving technical suggestions"], correctIndex: 0, explanation: "Feedback refines design robustness; viewing critiques constructively elevates engineering excellence." }
    ]
  },

  // ============================================================
  // 10. TEAMWORK & COLLABORATION
  // ============================================================
  teamwork: {
    id: "codechef-teamwork",
    skill: "Teamwork & Collaboration",
    category: "Professional",
    codechefCode: "CC-TEAM20",
    title: "CodeChef Engineering Teamwork & Collaboration Test",
    difficulty: "All Levels (Situational Judgment)",
    durationMinutes: 20,
    totalQuestions: 20,
    passingScore: 60,
    benchmarkScore: 80,
    description: "Evaluates psychological safety, pair programming, conflict resolution, PR etiquette, and cross-functional synergy.",
    subjects: [
      { id: 1, name: "Cross-Functional Synergy & Alignment", questionRange: "Q1 - Q5" },
      { id: 2, name: "Constructive PR Reviews & Code Etiquette", questionRange: "Q6 - Q10" },
      { id: 3, name: "Conflict Resolution & Healthy Disagreement", questionRange: "Q11 - Q15" },
      { id: 4, name: "Psychological Safety & Knowledge Sharing", questionRange: "Q16 - Q20" },
    ],
    questions: [
      { id: "tw-q1", subjectId: 1, subjectName: "Cross-Functional Synergy & Alignment", question: "What is psychological safety in a software engineering team according to Google's Project Aristotle?", options: ["A team climate where members feel safe to take interpersonal risks, ask questions, and admit mistakes without fear of ridicule", "Having security guards in the office", "Encrypting all internal chat messages", "Enforcing 100% test coverage"], correctIndex: 0, explanation: "Project Aristotle proved psychological safety is the #1 predictor of high-performing teams." },
      { id: "tw-q2", subjectId: 1, subjectName: "Cross-Functional Synergy & Alignment", question: "When product management and engineering have conflicting priorities on feature velocity vs technical debt, what is the best collaborative approach?", options: ["Align on a balanced sprint allocation (e.g. 70% features, 30% tech debt & stability) backed by reliability metrics", "Engineering ignores product roadmap and refactors in secret", "Product forces 100% feature velocity with zero refactoring", "Cancel the product release entirely"], correctIndex: 0, explanation: "Sustainable engineering requires collaborative capacity negotiation tied to reliability SLAs." },
      { id: "tw-q3", subjectId: 1, subjectName: "Cross-Functional Synergy & Alignment", question: "How does pair programming enhance team capability?", options: ["Continuous peer review, shared collective code ownership, and real-time knowledge transfer between engineers", "Doubles the cost of engineering with zero benefit", "Eliminates the need for compilers", "Ensures one developer can take a nap while the other types"], correctIndex: 0, explanation: "Pair programming reduces defect rates and accelerates cross-pollination of mental models." },
      { id: "tw-q4", subjectId: 1, subjectName: "Cross-Functional Synergy & Alignment", question: "What should a developer do if they realize they will miss an agreed sprint commitment?", options: ["Communicate proactively early in the sprint to the team and Scrum Master with revised estimates and blocker details", "Wait until the sprint demo and act surprised", "Silently mark tickets as complete without writing code", "Blame other team members"], correctIndex: 0, explanation: "Early transparent communication allows the team to re-balance tasks or re-scope deliverables." },
      { id: "tw-q5", subjectId: 1, subjectName: "Cross-Functional Synergy & Alignment", question: "What is an effective way to collaborate with QA engineers during sprint development?", options: ["Engage early during acceptance criteria definition, share test data, and review test plans together before merging", "Throw code over the wall to QA 10 minutes before deployment", "Argue that software developers never write bugs", "Refuse to fix any defects reported by QA"], correctIndex: 0, explanation: "Shift-left testing and early QA collaboration prevent defects before code reaches staging." },
      { id: "tw-q6", subjectId: 2, subjectName: "Constructive PR Reviews & Code Etiquette", question: "What is an ideal Pull Request size to facilitate thorough and prompt team code reviews?", options: ["Small, focused PRs (under 300-400 lines of change) addressing a single logical concern", "A gigantic PR with 8,000 modified files touching every subsystem", "Zero lines of code with only emojis", "A PR containing 15 unrelated feature refactors"], correctIndex: 0, explanation: "Small PRs have significantly higher review quality, faster cycle times, and lower bug risk." },
      { id: "tw-q7", subjectId: 2, subjectName: "Constructive PR Reviews & Code Etiquette", question: "When leaving minor styling suggestions on a PR that don't block functionality, how should they be tagged?", options: ["Prefix with `[Nit]` or `[Optional]` so the author knows it is non-blocking", "Block the PR and demand an architectural rewrite", "Silently reject the PR", "Message the team VP about indentation"], correctIndex: 0, explanation: "Labeling comments as [Nit] or [Optional] distinguishes blockers from polite suggestions." },
      { id: "tw-q8", subjectId: 2, subjectName: "Constructive PR Reviews & Code Etiquette", question: "What should a PR author do when a reviewer raises a legitimate bug in their code?", options: ["Thank the reviewer, push a fix with a test case, and mark the conversation resolved", "Argue defensively that the bug is edge-case and doesn't matter", "Delete the GitHub repository", "Merge the PR anyway using admin privileges"], correctIndex: 0, explanation: "Reviewers catch blind spots; gracious acknowledgment and unit test additions build trust." },
      { id: "tw-q9", subjectId: 2, subjectName: "Constructive PR Reviews & Code Etiquette", question: "What is the 'Boy Scout Rule' in collaborative software engineering?", options: ["Always leave the codebase a little cleaner than you found it", "Write code as fast as possible without comments", "Never touch legacy code", "Only work on personal side projects during sprints"], correctIndex: 0, explanation: "Incrementally improving nearby code during regular PRs combats entropy." },
      { id: "tw-q10", subjectId: 2, subjectName: "Constructive PR Reviews & Code Etiquette", question: "How should teams handle subjective debates about code formatting (spaces vs tabs)?", options: ["Automate formatting using linters (e.g. Prettier, Black, ESLint) in pre-commit hooks and CI pipelines", "Spend 2 hours arguing in every sprint meeting", "Let every developer use their own formatting on the same file", "Ban all linters"], correctIndex: 0, explanation: "Automated tooling removes bikeshedding and enforces unified standards objectively." },
      { id: "tw-q11", subjectId: 3, subjectName: "Conflict Resolution & Healthy Disagreement", question: "What does Amazon's leadership principle 'Have Backbone; Disagree and Commit' mean?", options: ["Respectfully debate technical disagreements based on data, but once a decision is made, commit 100% to its execution", "Keep complaining after a decision is finalized", "Never disagree with anyone", "Sabotage the project if your idea was not chosen"], correctIndex: 0, explanation: "Rigorous debate leads to optimal decisions; universal post-decision alignment ensures delivery." },
      { id: "tw-q12", subjectId: 3, subjectName: "Conflict Resolution & Healthy Disagreement", question: "When two senior engineers disagree strongly on whether to use GraphQL or REST, what is the best objective path forward?", options: ["Build quick Proof-of-Concepts (POCs) measuring developer velocity, caching, and network overhead against real use cases", "Conduct a shouting match in the office", "Flip a coin and do zero evaluation", "Refuse to build the feature until one engineer quits"], correctIndex: 0, explanation: "Empirical POC evaluations replace subjective opinions with observable data." },
      { id: "tw-q13", subjectId: 3, subjectName: "Conflict Resolution & Healthy Disagreement", question: "In a blameless post-mortem after a production outage, what is the focus?", options: ["Identifying systemic process and tooling vulnerabilities to prevent recurrence, rather than assigning personal blame", "Finding out who ran the command and firing them", "Hiding the outage from stakeholders", "Writing angry Slack messages"], correctIndex: 0, explanation: "Blameless post-mortems recognize that human error is a symptom of fragile systemic designs." },
      { id: "tw-q14", subjectId: 3, subjectName: "Conflict Resolution & Healthy Disagreement", question: "When an interpersonal conflict arises between two teammates, what is the recommended first step?", options: ["Have a direct, private, empathetic 1-on-1 conversation using 'I' statements to understand perspectives", "Gossip about the teammate in public group chats", "Complain to the CEO immediately", "Engage in passive-aggressive code reviews"], correctIndex: 0, explanation: "Direct private communication resolves misunderstandings before they fester." },
      { id: "tw-q15", subjectId: 3, subjectName: "Conflict Resolution & Healthy Disagreement", question: "What is an effective way to de-escalate emotional tension during a heated retrospective?", options: ["Take a short 5-minute break, refocus on shared goals, and write facts on a shared board", "Scream louder to dominate the conversation", "Walk out and slam the door", "Dismiss the team's emotions as irrelevant"], correctIndex: 0, explanation: "Pausing allows emotional de-escalation so the team can re-center on common objectives." },
      { id: "tw-q16", subjectId: 4, subjectName: "Psychological Safety & Knowledge Sharing", question: "What is the 'Bus Factor' (or Truck Factor) in software team resilience?", options: ["The minimum number of team members that would need to leave before a project halts due to lack of knowledge", "How many team members can fit on a bus for an offsite", "The throughput of network buses", "The number of bugs found per sprint"], correctIndex: 0, explanation: "A high bus factor (via cross-training and documentation) prevents critical single points of failure." },
      { id: "tw-q17", subjectId: 4, subjectName: "Psychological Safety & Knowledge Sharing", question: "How can teams encourage junior members to participate in architectural discussions?", options: ["Create an inclusive culture where questions are celebrated and explicitly solicit their thoughts in meetings", "Tell juniors their opinions don't count until 5 years of tenure", "Mute junior members during meetings", "Only allow senior engineers to speak"], correctIndex: 0, explanation: "Explicitly inviting input empowers emerging engineers and introduces fresh perspectives." },
      { id: "tw-q18", subjectId: 4, subjectName: "Psychological Safety & Knowledge Sharing", question: "What is a 'Lunch and Learn' or Tech Talk in engineering culture?", options: ["An informal team session where a developer presents a new technology, project learnings, or architectural pattern", "A mandatory exam during lunchtime", "A silent reading hour", "A performance review meeting"], correctIndex: 0, explanation: "Tech talks foster organic continuous learning and celebrate internal subject matter expertise." },
      { id: "tw-q19", subjectId: 4, subjectName: "Psychological Safety & Knowledge Sharing", question: "When a teammate successfully fixes a critical Sev-1 production incident, what should the team do?", options: ["Celebrate their achievement publicly in team shoutouts / kudos channels", "Ignore their work and complain about the bug", "Claim personal credit for their fix", "Assign them 5 additional on-call shifts"], correctIndex: 0, explanation: "Public recognition reinforces high morale and community solidarity." },
      { id: "tw-q20", subjectId: 4, subjectName: "Psychological Safety & Knowledge Sharing", question: "Why is maintaining shared runbooks and documentation vital for on-call rotation teams?", options: ["It empowers any engineer on-call to triage and recover services during 3 AM incidents without panic", "It keeps lawyers happy", "It replaces the need for monitoring", "It fills server hard drives"], correctIndex: 0, explanation: "Actionable runbooks ensure reliable operational triage regardless of who is holding the pager." }
    ]
  },

  // ============================================================
  // 11. LEADERSHIP & MENTORSHIP
  // ============================================================
  leadership: {
    id: "codechef-leadership",
    skill: "Leadership & Mentorship",
    category: "Professional",
    codechefCode: "CC-LEAD20",
    title: "CodeChef Technical Leadership & Mentorship Competency Test",
    difficulty: "Advanced (Situational Judgment)",
    durationMinutes: 20,
    totalQuestions: 20,
    passingScore: 60,
    benchmarkScore: 80,
    description: "Evaluates vision alignment, delegation, coaching junior developers, decision making under ambiguity, and accountability.",
    subjects: [
      { id: 1, name: "Technical Vision & Strategic Alignment", questionRange: "Q1 - Q5" },
      { id: 2, name: "Mentorship, Coaching & Talent Growth", questionRange: "Q6 - Q10" },
      { id: 3, name: "Decision Making Under Ambiguity", questionRange: "Q11 - Q15" },
      { id: 4, name: "Accountability, Ownership & Influence", questionRange: "Q16 - Q20" },
    ],
    questions: [
      { id: "ld-q1", subjectId: 1, subjectName: "Technical Vision & Strategic Alignment", question: "What distinguishes a Servant Leader from an authoritarian manager?", options: ["Servant leaders focus on unblocking, empowering, and developing their team members to succeed", "Servant leaders dictate every line of code written", "Servant leaders take all the credit for team achievements", "Servant leaders avoid making any decisions"], correctIndex: 0, explanation: "Servant leadership prioritizes team growth, psychological safety, and removing systemic obstacles." },
      { id: "ld-q2", subjectId: 1, subjectName: "Technical Vision & Strategic Alignment", question: "How should a tech lead formulate a multi-year technical vision for an engineering organization?", options: ["Align technical capabilities with long-term business strategy, scalability targets, and developer productivity goals", "Pick the newest JavaScript framework every 6 months on a whim", "Refuse to change any system built in the 1990s", "Write the vision in complete isolation without consulting engineers"], correctIndex: 0, explanation: "Strategic roadmaps harmonize technological investments with company growth milestones." },
      { id: "ld-q3", subjectId: 1, subjectName: "Technical Vision & Strategic Alignment", question: "What is an effective way to communicate team OKRs (Objectives and Key Results)?", options: ["Define measurable, outcome-focused Key Results (e.g. 'Reduce latency by 30%') tied to an inspiring Objective", "List 50 vague tasks without metrics", "Keep OKRs secret from the team", "Change the objectives every 3 days"], correctIndex: 0, explanation: "OKRs connect inspiring direction with quantified, verifiable metrics of success." },
      { id: "ld-q4", subjectId: 1, subjectName: "Technical Vision & Strategic Alignment", question: "When organizational priorities shift abruptly, what should a technical leader do?", options: ["Provide transparent context on the 'why' behind the pivot, re-align sprint roadmaps, and support the team through the transition", "Panic and complain to junior engineers", "Pretend nothing changed and build cancelled features", "Resign immediately"], correctIndex: 0, explanation: "Leadership anchors stability through transparency, empathetic reassurance, and strategic re-prioritization." },
      { id: "ld-q5", subjectId: 1, subjectName: "Technical Vision & Strategic Alignment", question: "What is the danger of accumulating unbounded technical debt?", options: ["Velocity decelerates exponentially, developer morale crashes, and system fragility causes frequent catastrophic outages", "Nothing, technical debt has zero impact", "It makes code compile 10x faster", "It reduces hosting bills"], correctIndex: 0, explanation: "Unchecked technical debt compounds interest, crippling team velocity and system resilience." },
      { id: "ld-q6", subjectId: 2, subjectName: "Mentorship, Coaching & Talent Growth", question: "What is the primary role of a mentor during a 1-on-1 coaching session?", options: ["Listen actively, ask powerful questions that guide the mentee to discover solutions, and support their career aspirations", "Do 90% of the talking and boast about past successes", "Review their daily git commits line-by-line", "Assign menial chores"], correctIndex: 0, explanation: "Coaching fosters autonomous critical thinking rather than spoon-feeding answers." },
      { id: "ld-q7", subjectId: 2, subjectName: "Mentorship, Coaching & Talent Growth", question: "How should a technical lead delegate an important architecture task to a mid-level engineer?", options: ["Clarify the expected outcome, constraints, and support checkpoints, then grant autonomy on implementation details", "Micromanage every variable name and check in every 20 minutes", "Give zero requirements and yell if it doesn't match an unstated expectation", "Do the task yourself secretly"], correctIndex: 0, explanation: "Effective delegation balances clear boundaries with execution autonomy." },
      { id: "ld-q8", subjectId: 2, subjectName: "Mentorship, Coaching & Talent Growth", question: "What is the GROW model used in professional leadership coaching?", options: ["Goal, Reality, Options, Will/Way Forward", "Generate, Refactor, Optimize, Write", "Git, Review, Organize, Win", "Growth, Revenue, Operations, Wealth"], correctIndex: 0, explanation: "The GROW framework guides individuals from goal definition through action commitment." },
      { id: "ld-q9", subjectId: 2, subjectName: "Mentorship, Coaching & Talent Growth", question: "How can a mentor help an engineer overcome 'Imposter Syndrome'?", options: ["Normalize that feeling out of depth is common during growth, highlight concrete evidence of their achievements, and frame challenges as learning opportunities", "Tell them they are indeed unqualified", "Ignore their feelings", "Give them only trivial tasks"], correctIndex: 0, explanation: "Validating self-doubt and highlighting verified objective wins helps recalibrate confidence." },
      { id: "ld-q10", subjectId: 2, subjectName: "Mentorship, Coaching & Talent Growth", question: "When an engineer expresses interest in becoming a staff engineer or tech lead, how should you support them?", options: ["Identify cross-team impact opportunities, sponsor them for high-visibility initiatives, and coach their architectural communication", "Tell them to wait 10 years", "Discourage them from taking on leadership", "Give all lead opportunities to outside hires"], correctIndex: 0, explanation: "Leadership sponsorship pairs ambitious talent with high-impact systemic challenges." },
      { id: "ld-q11", subjectId: 3, subjectName: "Decision Making Under Ambiguity", question: "What is Jeff Bezos' distinction between Type 1 and Type 2 decisions?", options: ["Type 1 decisions are irreversible one-way doors (require slow deliberate analysis); Type 2 decisions are reversible two-way doors (should be made rapidly)", "Type 1 is hardware; Type 2 is software", "Type 1 is frontend; Type 2 is backend", "Type 1 decisions are made by AI"], correctIndex: 0, explanation: "Two-way door decisions should be made quickly with 70% information, preserving velocity." },
      { id: "ld-q12", subjectId: 3, subjectName: "Decision Making Under Ambiguity", question: "When leading an incident response during an active production outage, what is the incident commander's priority?", options: ["Focus on rapid mitigation and restoring service to customers first; investigate deep root causes after stability is restored", "Conduct a 4-hour post-mortem while the site is still down", "Assign blame to the engineer who touched the repo", "Rewrite the application in Rust immediately"], correctIndex: 0, explanation: "In incident management, mitigation (rollback, traffic reroute) comes before forensics." },
      { id: "ld-q13", subjectId: 3, subjectName: "Decision Making Under Ambiguity", question: "How should a tech lead evaluate build vs buy decisions for a new capability?", options: ["Assess whether the capability is a core competitive differentiator for the business; buy commodity services (auth, monitoring) and build custom core IP", "Always build everything from scratch including database engines and text editors", "Never write code and buy 500 SaaS subscriptions", "Choose whatever product has the coolest swag"], correctIndex: 0, explanation: "Commodity infrastructure should be leveraged; engineering resources should focus on proprietary value." },
      { id: "ld-q14", subjectId: 3, subjectName: "Decision Making Under Ambiguity", question: "What is 'Analysis Paralysis' in engineering leadership?", options: ["Over-analyzing and over-researching choices to the point where decision-making is stalled and progress halts", "A compiler crash during static analysis", "A CPU deadlock in multi-threaded loops", "Testing software thoroughly"], correctIndex: 0, explanation: "Analysis paralysis sacrifices market velocity and team momentum for unattainable certainty." },
      { id: "ld-q15", subjectId: 3, subjectName: "Decision Making Under Ambiguity", question: "When data is incomplete, how does an effective engineering leader make progress?", options: ["Articulate hypotheses clearly, design low-cost experiments/spikes to gather empirical data, and iterate", "Wait months until someone else decides", "Guess wildly and gamble production stability", "Abandon the project"], correctIndex: 0, explanation: "Hypothesis-driven spikes de-risk technical unknowns rapidly." },
      { id: "ld-q16", subjectId: 4, subjectName: "Accountability, Ownership & Influence", question: "What does 'Extreme Ownership' (Jocko Willink) imply for an engineering team leader?", options: ["The leader takes total responsibility for everything in their world; there are no bad teams, only bad leaders", "Blaming junior engineers for bugs", "Blaming product managers for shifting requirements", "Taking all credit when things succeed and vanishing when they fail"], correctIndex: 0, explanation: "Extreme ownership means taking responsibility for team shortfalls and driving solutions proactively." },
      { id: "ld-q17", subjectId: 4, subjectName: "Accountability, Ownership & Influence", question: "How does a Staff+ engineer lead through 'influence without authority'?", options: ["By building technical consensus through data, clear RFCs, empathy, and inspiring shared purpose across teams", "By demanding compliance because of their job title", "By threatening colleagues with HR complaints", "By secretly overriding other teams' code repositories"], correctIndex: 0, explanation: "Senior leadership relies on persuasion, trusted relationships, and compelling technical reasoning." },
      { id: "ld-q18", subjectId: 4, subjectName: "Accountability, Ownership & Influence", question: "When an engineer on your team underperforms continuously, what is the responsible leadership action?", options: ["Provide timely, clear, compassionate feedback with specific examples, co-create an improvement plan, and support them actively", "Ignore it and let the team carry their weight indefinitely", "Fire them abruptly with zero prior warning", "Humiliate them in front of the team"], correctIndex: 0, explanation: "Fair leadership requires clear performance standards, objective coaching, and honest expectations." },
      { id: "ld-q19", subjectId: 4, subjectName: "Accountability, Ownership & Influence", question: "What is the best way to foster innovation in an engineering team?", options: ["Allocate dedicated exploration time (e.g. Hackathons, 20% time) and celebrate experiments even when they fail", "Punish any developer whose prototype does not immediately produce revenue", "Forbid anyone from reading technical blogs", "Enforce rigid waterfall development"], correctIndex: 0, explanation: "Innovation thrives where experimentation is safe and failure is treated as learning data." },
      { id: "ld-q20", subjectId: 4, subjectName: "Accountability, Ownership & Influence", question: "How does a leader protect their engineering team from burnout during intense release cycles?", options: ["Shield them from unvetted scope creep, push back on unrealistic deadlines, and ensure mandatory recovery periods post-launch", "Demand 80-hour workweeks every week indefinitely", "Cancel all vacations", "Pretend burnout is a myth"], correctIndex: 0, explanation: "Sustainable pacing and proactive boundary defense safeguard team health and retention." }
    ]
  },

  // ============================================================
  // 12. PROBLEM-SOLVING & CRITICAL THINKING
  // ============================================================
  problem_solving: {
    id: "codechef-problem-solving",
    skill: "Problem Solving & Critical Thinking",
    category: "Professional",
    codechefCode: "CC-PROB20",
    title: "CodeChef Critical Thinking, Aptitude & Problem Solving Test",
    difficulty: "CodeChef 4★ (Advanced Aptitude)",
    durationMinutes: 20,
    totalQuestions: 20,
    passingScore: 60,
    benchmarkScore: 80,
    description: "Evaluates first-principles thinking, root-cause analysis, quantitative aptitude, algorithmic debugging, and cognitive bias detection.",
    subjects: [
      { id: 1, name: "First-Principles Thinking & Problem Deconstruction", questionRange: "Q1 - Q5" },
      { id: 2, name: "Root-Cause Analysis & 5-Whys Methodology", questionRange: "Q6 - Q10" },
      { id: 3, name: "Quantitative Aptitude, Logic & Probabilistic Reasoning", questionRange: "Q11 - Q15" },
      { id: 4, name: "Algorithmic Debugging & Edge-Case Synthesis", questionRange: "Q16 - Q20" },
    ],
    questions: [
      { id: "ps-q1", subjectId: 1, subjectName: "First-Principles Thinking & Problem Deconstruction", question: "What is first-principles reasoning (Aristotelian deconstruction)?", options: ["Breaking a problem down to its most fundamental, indisputable truths and building up a solution from there", "Copying what other companies have done by analogy", "Accepting conventional wisdom without questioning", "Choosing the quickest available shortcut"], correctIndex: 0, explanation: "First principles boils things down to fundamental truths, avoiding inherited assumptions." },
      { id: "ps-q2", subjectId: 1, subjectName: "First-Principles Thinking & Problem Deconstruction", question: "When tasked with building a system handling 100,000 requests per second, what is the first analytical step?", options: ["Deconstruct the math: compute throughput, payload sizes, I/O bandwidth, and identify the primary physical bottleneck", "Buy the largest AWS server available immediately", "Start coding a web scraper", "Assume it is impossible"], correctIndex: 0, explanation: "Back-of-the-envelope calculations quantify physical and computational feasibility." },
      { id: "ps-q3", subjectId: 1, subjectName: "First-Principles Thinking & Problem Deconstruction", question: "What does Occam's Razor suggest when multiple competing hypotheses explain an observation?", options: ["The hypothesis with the fewest unproven assumptions is generally preferred", "The most complicated explanation is usually true", "The newest hypothesis is always correct", "The hypothesis suggested by the senior engineer is automatically right"], correctIndex: 0, explanation: "Occam's razor favors simplicity: don't multiply assumptions beyond necessity." },
      { id: "ps-q4", subjectId: 1, subjectName: "First-Principles Thinking & Problem Deconstruction", question: "What is Confirmation Bias in engineering problem solving?", options: ["The tendency to search for, interpret, and recall information that confirms preexisting beliefs while ignoring contrary data", "A database confirmation protocol", "Unit test assertion success", "Two-factor authentication"], correctIndex: 0, explanation: "Confirmation bias blinds engineers to contradictory logs and telemetry." },
      { id: "ps-q5", subjectId: 1, subjectName: "First-Principles Thinking & Problem Deconstruction", question: "How does the Sunk Cost Fallacy mislead engineering teams?", options: ["Continuing to invest resources into a failing architecture solely because substantial time and money have already been spent", "Spending money on cloud compute", "Discounting legacy hardware", "Investing in employee training"], correctIndex: 0, explanation: "Past irreversible expenses should not dictate future rational resource allocation." },
      { id: "ps-q6", subjectId: 2, subjectName: "Root-Cause Analysis & 5-Whys Methodology", question: "What is the core technique of the 5-Whys methodology?", options: ["Drilling down into the root cause of a defect by asking 'Why did this happen?' iteratively (typically 5 times)", "Asking 5 different people for their opinion", "Delaying bug fixes by 5 days", "Generating 5 automated unit tests"], correctIndex: 0, explanation: "The 5-Whys technique moves past superficial symptoms to uncover systemic failures." },
      { id: "ps-q7", subjectId: 2, subjectName: "Root-Cause Analysis & 5-Whys Methodology", question: "In a fishbone (Ishikawa) diagram, what are the primary branches used to categorize causes of defects?", options: ["People, Process, Technology/Equipment, Environment, Materials, and Methods", "CPU, RAM, Disk, Network", "Frontend, Backend, DevOps, QA", "HTML, CSS, JS, Python"], correctIndex: 0, explanation: "Ishikawa diagrams organize causes across systemic categories (Methods, Machines, Materials, Manpower, Measurement, Milieu)." },
      { id: "ps-q8", subjectId: 2, subjectName: "Root-Cause Analysis & 5-Whys Methodology", question: "A server crashes due to an out-of-memory (OOM) error. Which of the following is a TRUE root cause rather than a symptom?", options: ["An unbounded in-memory cache was lacking an eviction policy (TTL / LRU)", "The Linux OOM killer killed the process", "The server ran out of RAM", "The HTTP request returned 500"], correctIndex: 0, explanation: "Lack of eviction policy is the underlying defect causing the OOM symptom." },
      { id: "ps-q9", subjectId: 2, subjectName: "Root-Cause Analysis & 5-Whys Methodology", question: "What is the difference between a bug's proximal cause and its root cause?", options: ["Proximal cause is the immediate trigger; root cause is the foundational systemic condition that permitted the trigger to happen", "There is no difference", "Proximal causes are in hardware; root causes are in software", "Proximal causes can never be fixed"], correctIndex: 0, explanation: "Treating only proximal causes guarantees the defect will recur through alternative triggers." },
      { id: "ps-q10", subjectId: 2, subjectName: "Root-Cause Analysis & 5-Whys Methodology", question: "Why is fixing a bug by adding a 5-second `sleep()` generally considered an anti-pattern?", options: ["It masks an underlying race condition or synchronization defect rather than solving it properly", "It speeds up the program too much", "Sleep commands are forbidden in all programming languages", "It causes compiler errors"], correctIndex: 0, explanation: "Arbitrary sleeps hide race conditions and introduce non-deterministic latency." },
      { id: "ps-q11", subjectId: 3, subjectName: "Quantitative Aptitude, Logic & Probabilistic Reasoning", question: "If 5 workers can build 5 servers in 5 hours, how many hours does it take 100 workers to build 100 servers?", options: ["5 hours", "100 hours", "1 hour", "25 hours"], correctIndex: 0, explanation: "Each worker builds 1 server in 5 hours. Therefore, 100 workers building 100 servers simultaneously takes 5 hours." },
      { id: "ps-q12", subjectId: 3, subjectName: "Quantitative Aptitude, Logic & Probabilistic Reasoning", question: "In a group of 23 people, what is the approximate probability that at least two people share the exact same birthday (The Birthday Paradox)?", options: ["Over 50%", "About 6%", "About 23%", "Under 1%"], correctIndex: 0, explanation: "With 23 people, there are 253 pairs; the probability of at least one collision is ~50.7%." },
      { id: "ps-q13", subjectId: 3, subjectName: "Quantitative Aptitude, Logic & Probabilistic Reasoning", question: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?", options: ["$0.05 (5 cents)", "$0.10 (10 cents)", "$0.01 (1 cent)", "$0.55 (55 cents)"], correctIndex: 0, explanation: "Let ball = x. Bat = x + 1.00. x + x + 1.00 = 1.10 -> 2x = 0.10 -> x = $0.05." },
      { id: "ps-q14", subjectId: 3, subjectName: "Quantitative Aptitude, Logic & Probabilistic Reasoning", question: "You have 8 balls that look identical, but one is slightly heavier than the other 7. Using a balance scale, what is the MINIMUM number of weighings needed to guarantee finding the heavy ball?", options: ["2 weighings", "3 weighings", "4 weighings", "1 weighing"], correctIndex: 0, explanation: "Weigh 3 vs 3. If balanced, heavy is in remaining 2 (1 more weighing). If unbalanced, weigh 1 vs 1 from the heavier group. 2 weighings guaranteed." },
      { id: "ps-q15", subjectId: 3, subjectName: "Quantitative Aptitude, Logic & Probabilistic Reasoning", question: "What is Bayes' Theorem used to calculate?", options: ["The posterior probability of an event given prior knowledge of conditions related to the event", "The perimeter of an ellipse", "The sorting complexity of arrays", "The CPU cycle latency"], correctIndex: 0, explanation: "P(A|B) = P(B|A) * P(A) / P(B) updates beliefs based on new evidence." },
      { id: "ps-q16", subjectId: 4, subjectName: "Algorithmic Debugging & Edge-Case Synthesis", question: "What technique is used when bisecting a codebase over git commits to locate the exact commit that introduced a regression?", options: ["`git bisect` (binary search through commit history)", "`git rebase -i`", "`git cherry-pick`", "`git stash`"], correctIndex: 0, explanation: "git bisect uses binary search over commit history to pinpoint the introducing commit in O(log N) steps." },
      { id: "ps-q17", subjectId: 4, subjectName: "Algorithmic Debugging & Edge-Case Synthesis", question: "What is 'Rubber Duck Debugging'?", options: ["Explaining code line-by-line to an inanimate object, which forces articulation and exposes flawed assumptions", "A memory testing tool in C++", "A unit test framework", "Deploying software on yellow servers"], correctIndex: 0, explanation: "Verbalizing logic line by line exposes gaps between intended behavior and actual execution." },
      { id: "ps-q18", subjectId: 4, subjectName: "Algorithmic Debugging & Edge-Case Synthesis", question: "Which edge cases must ALWAYS be tested when designing algorithms on arrays or lists?", options: ["Empty array, single-element array, all elements identical, sorted in reverse, and extreme boundary values", "Only random arrays of size 10", "Only arrays containing the number 42", "None if the code compiled without warnings"], correctIndex: 0, explanation: "Boundary conditions (N=0, N=1, duplicates, extremes) account for the vast majority of software defects." },
      { id: "ps-q19", subjectId: 4, subjectName: "Algorithmic Debugging & Edge-Case Synthesis", question: "What causes an Integer Overflow error in binary arithmetic?", options: ["An arithmetic operation produces a numeric value outside the maximum representable range of the integer type", "Dividing by zero", "Allocating an array larger than 100 elements", "Using float instead of double"], correctIndex: 0, explanation: "Exceeding the maximum representable integer causes wraparound or undefined behavior." },
      { id: "ps-q20", subjectId: 4, subjectName: "Algorithmic Debugging & Edge-Case Synthesis", question: "When optimizing an algorithm from O(N^2) to O(N log N), what is typically traded off?", options: ["Often trading auxiliary memory space (e.g. hash maps or auxiliary arrays) for execution speed", "Trading code correctness", "Trading network security", "Decreasing CPU clock speed"], correctIndex: 0, explanation: "The Space-Time Tradeoff frequently trades additional auxiliary memory to achieve faster asymptotic time complexity." }
    ]
  },

  // ============================================================
  // 13. TIME & PROJECT MANAGEMENT
  // ============================================================
  time_management: {
    id: "codechef-time-management",
    skill: "Project & Time Management",
    category: "Professional",
    codechefCode: "CC-TIME20",
    title: "CodeChef Agile Project & Time Management Competency Test",
    difficulty: "All Levels (Situational Judgment)",
    durationMinutes: 20,
    totalQuestions: 20,
    passingScore: 60,
    benchmarkScore: 80,
    description: "Evaluates prioritization (Eisenhower Matrix), Agile sprint planning, bottleneck elimination, deep work, and deadline risk management.",
    subjects: [
      { id: 1, name: "Prioritization & The Eisenhower Matrix", questionRange: "Q1 - Q5" },
      { id: 2, name: "Agile Sprint Scoping & Story Point Estimation", questionRange: "Q6 - Q10" },
      { id: 3, name: "Deep Work, Focus Blocks & Distraction Control", questionRange: "Q11 - Q15" },
      { id: 4, name: "Dependency Mapping, Bottlenecks & Risk Mitigation", questionRange: "Q16 - Q20" },
    ],
    questions: [
      { id: "tm-q1", subjectId: 1, subjectName: "Prioritization & The Eisenhower Matrix", question: "In the Eisenhower Matrix, which quadrant should receive the highest proactive focus to prevent crises?", options: ["Quadrant 2: Important, but Not Urgent (Strategic planning, refactoring, health)", "Quadrant 1: Urgent and Important (Crises and firefighting)", "Quadrant 3: Urgent, but Not Important (Interruptions)", "Quadrant 4: Not Urgent and Not Important (Time wasters)"], correctIndex: 0, explanation: "Investing in Q2 (Important, Not Urgent) prevents tasks from becoming emergency Q1 crises." },
      { id: "tm-q2", subjectId: 1, subjectName: "Prioritization & The Eisenhower Matrix", question: "What is Pareto's Principle (80/20 rule) in software project execution?", options: ["80% of value or outcomes often result from 20% of effort or key features", "80% of code must be written by 20% of developers", "Every project takes 80 days", "80% of lines must be comments"], correctIndex: 0, explanation: "Pareto's principle helps teams focus on high-leverage activities that produce outsized value." },
      { id: "tm-q3", subjectId: 1, subjectName: "Prioritization & The Eisenhower Matrix", question: "What is Parkinson's Law?", options: ["Work expands to fill the time available for its completion", "The number of transistors doubles every 2 years", "Every software has at least one bug", "Code written on Fridays fails in production"], correctIndex: 0, explanation: "Parkinson's Law warns that excessive deadlines cause tasks to drag out unnecessarily." },
      { id: "tm-q4", subjectId: 1, subjectName: "Prioritization & The Eisenhower Matrix", question: "What does the MoSCoW prioritization method stand for?", options: ["Must-have, Should-have, Could-have, Won't-have (this time)", "Maximum, Optimal, Standard, Critical", "Management, Operations, Security, Compliance", "Modern, Scalable, Cloud-native, Web"], correctIndex: 0, explanation: "MoSCoW establishes clear boundaries on non-negotiable vs optional scope." },
      { id: "tm-q5", subjectId: 1, subjectName: "Prioritization & The Eisenhower Matrix", question: "When three stakeholders demand urgent conflicting features simultaneously, what should an engineering lead do?", options: ["Facilitate a prioritization session using transparent impact vs effort matrices to sequence work objectively", "Attempt to do all three simultaneously in 100-hour workweeks", "Promise all three by tomorrow and fail all of them", "Work on none of them"], correctIndex: 0, explanation: "Transparent trade-off frameworks force explicit stakeholder prioritization." },
      { id: "tm-q6", subjectId: 2, subjectName: "Agile Sprint Scoping & Story Point Estimation", question: "What do Story Points in Agile estimation represent?", options: ["Relative effort, complexity, and uncertainty, rather than exact calendar hours", "The exact number of hours an engineer will sit at the keyboard", "The financial cost of the ticket", "The number of lines of code to write"], correctIndex: 0, explanation: "Story points quantify relative complexity and uncertainty across team capabilities." },
      { id: "tm-q7", subjectId: 2, subjectName: "Agile Sprint Scoping & Story Point Estimation", question: "Why is the modified Fibonacci sequence (1, 2, 3, 5, 8, 13, 21...) used for Planning Poker?", options: ["Because uncertainty increases exponentially as task size and complexity grow", "Because Leonardo Fibonacci was a software architect", "To calculate database index sizes", "It is enforced by Scrum certification law"], correctIndex: 0, explanation: "Estimating large tasks with fine granularity is an illusion; exponential gaps reflect natural uncertainty." },
      { id: "tm-q8", subjectId: 2, subjectName: "Agile Sprint Scoping & Story Point Estimation", question: "What is 'Scope Creep' in project management?", options: ["Uncontrolled continuous addition of new features and requirements without adjusting timeline or resources", "Refactoring code to improve readability", "Deleting unused CSS files", "Hiring additional developers"], correctIndex: 0, explanation: "Scope creep silently expands deliverables until deadlines and budgets are blown." },
      { id: "tm-q9", subjectId: 2, subjectName: "Agile Sprint Scoping & Story Point Estimation", question: "What is the primary objective of a daily standup meeting in Agile?", options: ["Briefly synchronize on progress, flag blockers, and coordinate collaboration for the next 24 hours (15 mins max)", "Deliver a 2-hour status report to executives", "Conduct performance reviews", "Write code together"], correctIndex: 0, explanation: "Daily standups are quick coordination checkpoints focused on removing blockers." },
      { id: "tm-q10", subjectId: 2, subjectName: "Agile Sprint Scoping & Story Point Estimation", question: "What metric measures how many story points a team completes per sprint on average?", options: ["Sprint Velocity", "Burndown Slope", "Lead Time", "Throughput Coefficient"], correctIndex: 0, explanation: "Velocity tracks historical points delivered, stabilizing future sprint forecasting." },
      { id: "tm-q11", subjectId: 3, subjectName: "Deep Work, Focus Blocks & Distraction Control", question: "What is 'Context Switching' cost in knowledge and engineering work?", options: ["The cognitive penalty and time loss incurred every time a worker switches between unrelated tasks or interruptions", "The time to switch branch in Git", "The CPU thread scheduling overhead", "The cost of switching cloud providers"], correctIndex: 0, explanation: "Studies show it takes up to 20-23 minutes to regain deep focus after a significant interruption." },
      { id: "tm-q12", subjectId: 3, subjectName: "Deep Work, Focus Blocks & Distraction Control", question: "What is 'Time Boxing' (or Calendar Blocking)?", options: ["Allocating a dedicated, fixed time window on the calendar exclusively to work on a specific task without interruptions", "Limiting meetings to 5 people", "Boxing up old computer hardware", "Setting a timer on code reviews"], correctIndex: 0, explanation: "Time boxing protects calendar space for high-leverage cognitive focus." },
      { id: "tm-q13", subjectId: 3, subjectName: "Deep Work, Focus Blocks & Distraction Control", question: "What is the Pomodoro Technique?", options: ["Working in focused 25-minute intervals separated by short 5-minute breaks", "Cooking Italian pasta while waiting for code to compile", "Working 12 hours straight without water", "A technique for designing web layouts"], correctIndex: 0, explanation: "Pomodoro structures attention in sustained intervals with deliberate restorative pauses." },
      { id: "tm-q14", subjectId: 3, subjectName: "Deep Work, Focus Blocks & Distraction Control", question: "How should an engineer manage continuous non-urgent Slack/email notifications?", options: ["Mute notifications during scheduled deep work blocks and check them in dedicated batches 2-3 times a day", "Reply instantly within 5 seconds to every message 24/7", "Uninstall Slack completely and never communicate", "Forward all emails to their manager"], correctIndex: 0, explanation: "Batching asynchronous communication preserves unbroken focus for complex coding." },
      { id: "tm-q15", subjectId: 3, subjectName: "Deep Work, Focus Blocks & Distraction Control", question: "What is the 'Two-Minute Rule' in task management?", options: ["If an action takes less than two minutes to complete, do it immediately rather than deferring it", "Never speak for more than 2 minutes in standup", "All unit tests must pass in 2 minutes", "Keep meetings under 2 minutes"], correctIndex: 0, explanation: "The two-minute rule prevents trivial micro-tasks from cluttering mental to-do lists." },
      { id: "tm-q16", subjectId: 4, subjectName: "Dependency Mapping, Bottlenecks & Risk Mitigation", question: "What is the Critical Path in project scheduling?", options: ["The longest sequence of dependent activities that dictates the minimum possible time to complete the project", "The path with the highest financial budget", "The network cable route to the server", "The quickest path to an MVP"], correctIndex: 0, explanation: "Any delay on the Critical Path directly delays the final completion date of the entire project." },
      { id: "tm-q17", subjectId: 4, subjectName: "Dependency Mapping, Bottlenecks & Risk Mitigation", question: "According to the Theory of Constraints (Goldratt), where should optimization efforts be focused?", options: ["On the primary bottleneck (constraint) that limits the throughput of the entire system", "Equally across all departments simultaneously", "On the fastest team in the organization", "On marketing rather than engineering"], correctIndex: 0, explanation: "An hour lost on a bottleneck is an hour lost for the entire system; optimizing non-bottlenecks creates an illusion of progress." },
      { id: "tm-q18", subjectId: 4, subjectName: "Dependency Mapping, Bottlenecks & Risk Mitigation", question: "In Kanban systems, what is the purpose of WIP (Work in Progress) limits?", options: ["To prevent multitasking, expose workflow bottlenecks, and maximize the throughput of completed tasks", "To limit how many hours employees can work", "To restrict the number of git branches created", "To cap company revenue"], correctIndex: 0, explanation: "WIP limits stop 'starting' and encourage 'finishing', reducing cycle times." },
      { id: "tm-q19", subjectId: 4, subjectName: "Dependency Mapping, Bottlenecks & Risk Mitigation", question: "What is a Spike in Agile development?", options: ["A time-boxed research task to explore an unknown technical approach and reduce estimation risk", "A sudden unexpected traffic surge on production servers", "A critical security bug", "An angry escalation email"], correctIndex: 0, explanation: "Spikes de-risk technical unknowns before full commitment to implementation user stories." },
      { id: "tm-q20", subjectId: 4, subjectName: "Dependency Mapping, Bottlenecks & Risk Mitigation", question: "What is a Risk Register in project management?", options: ["A living document logging potential project risks, their probability, business impact, and concrete mitigation strategies", "A list of fired employees", "A ledger of company expenses", "A list of software licenses"], correctIndex: 0, explanation: "Risk registers proactively map potential failure points and assign preventative mitigation actions." }
    ]
  },

  // ============================================================
  // 14. APTITUDE & LOGICAL REASONING
  // ============================================================
  aptitude: {
    id: "codechef-aptitude",
    skill: "General & Technical Aptitude",
    category: "Professional",
    codechefCode: "CC-APT20",
    title: "CodeChef Industry General & Technical Aptitude Test",
    difficulty: "CodeChef 3★ (Intermediate)",
    durationMinutes: 20,
    totalQuestions: 20,
    passingScore: 60,
    benchmarkScore: 80,
    description: "Standard campus & corporate placement evaluation covering quantitative math, logical deduction, verbal reasoning, and data interpretation.",
    subjects: [
      { id: 1, name: "Quantitative Aptitude & Arithmetic", questionRange: "Q1 - Q5" },
      { id: 2, name: "Logical Deduction & Pattern Series", questionRange: "Q6 - Q10" },
      { id: 3, name: "Verbal Ability & Sentence Logic", questionRange: "Q11 - Q15" },
      { id: 4, name: "Data Interpretation & Analytical Charts", questionRange: "Q16 - Q20" },
    ],
    questions: [
      { id: "apt-q1", subjectId: 1, subjectName: "Quantitative Aptitude & Arithmetic", question: "A train running at 72 km/h crosses a 200m long platform in 20 seconds. What is the length of the train?", options: ["200 m", "250 m", "150 m", "300 m"], correctIndex: 0, explanation: "Speed = 72 * (5/18) = 20 m/s. Total distance in 20s = 20 * 20 = 400m. Train length = 400 - 200 = 200m." },
      { id: "apt-q2", subjectId: 1, subjectName: "Quantitative Aptitude & Arithmetic", question: "If A can finish a work in 12 days and B can finish it in 24 days, in how many days can they complete it working together?", options: ["8 days", "6 days", "10 days", "9 days"], correctIndex: 0, explanation: "Combined rate = 1/12 + 1/24 = 3/24 = 1/8. Total days = 8 days." },
      { id: "apt-q3", subjectId: 1, subjectName: "Quantitative Aptitude & Arithmetic", question: "The ratio of ages of two persons is 4:5 and the sum of their ages is 54 years. What is the age of the elder person?", options: ["30 years", "24 years", "28 years", "32 years"], correctIndex: 0, explanation: "9 units = 54 -> 1 unit = 6 years. Elder age = 5 * 6 = 30 years." },
      { id: "apt-q4", subjectId: 1, subjectName: "Quantitative Aptitude & Arithmetic", question: "A shopkeeper sells an article at 20% profit on cost price of $250. What is the selling price?", options: ["$300", "$280", "$320", "$290"], correctIndex: 0, explanation: "Selling price = 250 * 1.20 = $300." },
      { id: "apt-q5", subjectId: 1, subjectName: "Quantitative Aptitude & Arithmetic", question: "What is the probability of getting a sum of 7 when rolling two fair 6-sided dice?", options: ["1/6", "1/12", "5/36", "7/36"], correctIndex: 0, explanation: "Pairs summing to 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 pairs out of 36 = 1/6." },
      { id: "apt-q6", subjectId: 2, subjectName: "Logical Deduction & Pattern Series", question: "Find the next number in the series: 3, 7, 15, 31, 63, ?", options: ["127", "126", "125", "128"], correctIndex: 0, explanation: "Pattern is (x * 2) + 1. 63 * 2 + 1 = 127." },
      { id: "apt-q7", subjectId: 2, subjectName: "Logical Deduction & Pattern Series", question: "Pointing to a photograph, a woman says: 'He is the son of the only daughter of my father.' How is the man in the photograph related to the woman?", options: ["Son", "Brother", "Nephew", "Father"], correctIndex: 0, explanation: "'The only daughter of my father' is the woman herself. Therefore, he is her son." },
      { id: "apt-q8", subjectId: 2, subjectName: "Logical Deduction & Pattern Series", question: "If 'CLOUD' is coded as 'DMPVE', how is 'RAIN' coded?", options: ["SBJO", "SZJM", "SAIN", "QBJM"], correctIndex: 0, explanation: "Each letter is shifted forward by +1: R->S, A->B, I->J, N->O." },
      { id: "apt-q9", subjectId: 2, subjectName: "Logical Deduction & Pattern Series", question: "Statements: All cats are animals. All animals are mammals. Conclusion: All cats are mammals.", options: ["Conclusion is definitely valid", "Conclusion is invalid", "Cannot be determined", "Only partially valid"], correctIndex: 0, explanation: "Classic categorical syllogism: A sub B and B sub C implies A sub C." },
      { id: "apt-q10", subjectId: 2, subjectName: "Logical Deduction & Pattern Series", question: "Which word does not belong with the others: Apple, Orange, Banana, Potato?", options: ["Potato (vegetable / tuber)", "Apple", "Orange", "Banana"], correctIndex: 0, explanation: "Potato is an underground tuber vegetable, while the others are fruits." },
      { id: "apt-q11", subjectId: 3, subjectName: "Verbal Ability & Sentence Logic", question: "Choose the correct antonym of 'EPHEMERAL':", options: ["Permanent", "Transitory", "Fleeting", "Fragile"], correctIndex: 0, explanation: "Ephemeral means short-lived or transitory; its direct antonym is permanent or everlasting." },
      { id: "apt-q12", subjectId: 3, subjectName: "Verbal Ability & Sentence Logic", question: "Select the sentence with correct grammatical agreement:", options: ["Neither of the options is acceptable.", "Neither of the options are acceptable.", "Neither of the option is acceptable.", "Neither of the options were acceptable without."], correctIndex: 0, explanation: "'Neither' is a singular distributive pronoun and requires the singular verb 'is'." },
      { id: "apt-q13", subjectId: 3, subjectName: "Verbal Ability & Sentence Logic", question: "Choose the word closest in meaning to 'PRAGMATIC':", options: ["Practical", "Theoretical", "Emotional", "Idealistic"], correctIndex: 0, explanation: "Pragmatic means dealing with matters realistically and practically." },
      { id: "apt-q14", subjectId: 3, subjectName: "Verbal Ability & Sentence Logic", question: "Identify the correctly spelled word:", options: ["Accommodation", "Accomodation", "Acommodation", "Acomodation"], correctIndex: 0, explanation: "The correct spelling has double 'c' and double 'm': Accommodation." },
      { id: "apt-q15", subjectId: 3, subjectName: "Verbal Ability & Sentence Logic", question: "Fill in the blank: 'The scientist was praised for her _____ research on quantum computing.'", options: ["meticulous", "careless", "superficial", "mediocre"], correctIndex: 0, explanation: "'Meticulous' (showing great attention to detail) fits the complimentary context of being praised." },
      { id: "apt-q16", subjectId: 4, subjectName: "Data Interpretation & Analytical Charts", question: "A company's revenue increased from $120k to $180k in one year. What is the percentage increase?", options: ["50%", "60%", "33.3%", "40%"], correctIndex: 0, explanation: "Increase = (180 - 120) / 120 = 60 / 120 = 50%." },
      { id: "apt-q17", subjectId: 4, subjectName: "Data Interpretation & Analytical Charts", question: "In a pie chart representing college expenses, 90 degrees corresponds to what percentage of the total budget?", options: ["25%", "30%", "20%", "35%"], correctIndex: 0, explanation: "A full circle is 360 degrees. 90 / 360 = 1/4 = 25%." },
      { id: "apt-q18", subjectId: 4, subjectName: "Data Interpretation & Analytical Charts", question: "A team solved 45 tickets on Monday, 55 on Tuesday, 60 on Wednesday, and 40 on Thursday. What is the daily mean?", options: ["50 tickets", "48 tickets", "52 tickets", "55 tickets"], correctIndex: 0, explanation: "Mean = (45 + 55 + 60 + 40) / 4 = 200 / 4 = 50 tickets." },
      { id: "apt-q19", subjectId: 4, subjectName: "Data Interpretation & Analytical Charts", question: "If the median of five sorted integers [12, 15, x, 22, 28] is 19, what is x?", options: ["19", "18", "20", "15"], correctIndex: 0, explanation: "In a sorted list of 5 elements, the median is the 3rd element (x = 19)." },
      { id: "apt-q20", subjectId: 4, subjectName: "Data Interpretation & Analytical Charts", question: "A bar chart shows sales: Q1: 400, Q2: 600, Q3: 500, Q4: 700. What fraction of total yearly sales was achieved in Q2?", options: ["6/22 (27.3%)", "1/4 (25%)", "1/3 (33.3%)", "1/5 (20%)"], correctIndex: 0, explanation: "Total sales = 400 + 600 + 500 + 700 = 2200. Q2 fraction = 600 / 2200 = 6/22 (approx 27.27%)." }
    ]
  }
};

/**
 * Returns a specific CodeChef Skill Test by key or normalized name.
 */
export function getCodeChefTest(skillIdentifier) {
  if (!skillIdentifier) return CODECHEF_SKILL_TESTS.python;
  const clean = skillIdentifier.toLowerCase().trim();

  if (clean.includes("python")) return CODECHEF_SKILL_TESTS.python;
  if (clean.includes("java") && !clean.includes("script")) return CODECHEF_SKILL_TESTS.java;
  if (clean === "c" || clean.startsWith("c ") || clean.includes("c programming") || clean.includes("c /")) return CODECHEF_SKILL_TESTS.c;
  if (clean.includes("sql") || clean.includes("database")) return CODECHEF_SKILL_TESTS.sql;
  if (clean.includes("machine learning") || clean === "ml") return CODECHEF_SKILL_TESTS.ml;
  if (clean.includes("data structure") || clean.includes("algorithm") || clean === "dsa") return CODECHEF_SKILL_TESTS.dsa;
  if (clean.includes("web") || clean.includes("react") || clean.includes("frontend")) return CODECHEF_SKILL_TESTS.webdev;
  if (clean.includes("cloud") || clean.includes("aws") || clean.includes("gcp")) return CODECHEF_SKILL_TESTS.cloud;
  if (clean.includes("aptitude") || clean.includes("reasoning")) return CODECHEF_SKILL_TESTS.aptitude;
  if (clean.includes("communi") || clean.includes("presentation")) return CODECHEF_SKILL_TESTS.communication;
  if (clean.includes("team") || clean.includes("collab")) return CODECHEF_SKILL_TESTS.teamwork;
  if (clean.includes("leader") || clean.includes("mentor")) return CODECHEF_SKILL_TESTS.leadership;
  if (clean.includes("problem") || clean.includes("critical") || clean.includes("solving")) return CODECHEF_SKILL_TESTS.problem_solving;
  if (clean.includes("time") || clean.includes("project manage")) return CODECHEF_SKILL_TESTS.time_management;

  return CODECHEF_SKILL_TESTS.python;
}
