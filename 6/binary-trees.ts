type OptionalTreeNode = TreeNode | null;
class TreeNode {
  #leftChild: OptionalTreeNode;
  #rightChild: OptionalTreeNode;
  #key: number;

  #parent: OptionalTreeNode;

  constructor({
    key,
    parent = null,
    leftChild = null,
    rightChild = null,
  }: {
    key: number;
    parent?: OptionalTreeNode;
    rightChild?: OptionalTreeNode;
    leftChild?: OptionalTreeNode;
  }) {
    this.#key = key;
    this.#parent = parent;
    this.#rightChild = rightChild;
    this.#leftChild = leftChild;
  }

  public set key(value: number) {
    this.#key = value;
  }

  public get key() {
    return this.#key;
  }

  public set parent(node: OptionalTreeNode) {
    this.#parent = node;
  }

  public get parent() {
    return this.#parent;
  }

  public set leftChild(node: OptionalTreeNode) {
    this.#leftChild = node;
  }

  public get leftChild() {
    return this.#leftChild;
  }

  public set rightChild(node: OptionalTreeNode) {
    this.#rightChild = node;
  }

  public get rightChild() {
    return this.#rightChild;
  }
}

class BinaryTree {
  #root: OptionalTreeNode;
  constructor({ root }: { root: OptionalTreeNode } = { root: null }) {
    this.#root = root;
  }

  public set root(node: OptionalTreeNode) {
    this.#root = node;
  }

  public get root() {
    return this.#root;
  }

  inOrderTraversal(node?: OptionalTreeNode) {
    let currentNode = node === undefined ? this.root : node;
    if (currentNode === null) return console.log('empty tree');

    currentNode.leftChild !== null &&
      this.inOrderTraversal(currentNode.leftChild);

    console.table([
      {
        key: currentNode.key,
        leftChild: currentNode.leftChild?.key,
        rightChild: currentNode.rightChild?.key,
        parent: currentNode.parent?.key,
      },
    ]);

    currentNode.rightChild !== null &&
      this.inOrderTraversal(currentNode.rightChild);
  }

  insertNode(newNode: TreeNode) {
    if (this.root !== null) {
      let currentNode = this.root;
      while (currentNode) {
        if (currentNode.key === newNode.key) return;
        if (newNode.key > currentNode.key) {
          if (currentNode.rightChild === null) {
            newNode.parent = currentNode;
            currentNode.rightChild = newNode;
            return;
          }
          currentNode = currentNode.rightChild;
        } else {
          if (currentNode.leftChild === null) {
            newNode.parent = currentNode;
            currentNode.leftChild = newNode;
            return;
          }
          currentNode = currentNode.leftChild;
        }
      }
      return;
    }
    this.root = newNode;
  }

  transplantNodes(nodeToReplace: TreeNode, newNode: OptionalTreeNode) {
    if (nodeToReplace.parent === null) {
      this.#root = newNode;
    } else if (nodeToReplace.parent.leftChild?.key === nodeToReplace.key) {
      nodeToReplace.parent.leftChild = newNode;
    } else if (nodeToReplace.parent.rightChild?.key === nodeToReplace.key) {
      nodeToReplace.parent.rightChild = newNode;
    }
    if (newNode) newNode.parent = nodeToReplace.parent;
  }

  removeNode(key: number) {
    const nodeToDelete = this.searchNodeRecursive(key);
    if (!nodeToDelete) return;

    if (nodeToDelete.parent === null) return (this.#root = null);

    if (nodeToDelete.leftChild === null && nodeToDelete.rightChild === null)
      return this.transplantNodes(nodeToDelete, null);

    if (nodeToDelete.leftChild !== null && nodeToDelete.rightChild !== null) {
      let nodeNextToDeleted = this.getMinNode(nodeToDelete.rightChild);
      if (nodeNextToDeleted === null) return;

      if (
        nodeNextToDeleted.parent &&
        nodeNextToDeleted.parent.key !== nodeToDelete.key
      ) {
        this.transplantNodes(nodeNextToDeleted, nodeNextToDeleted?.parent);
        nodeNextToDeleted.rightChild = nodeToDelete.rightChild;
        nodeNextToDeleted.rightChild.parent = nodeNextToDeleted;
      }

      this.transplantNodes(nodeToDelete, nodeNextToDeleted);
      nodeNextToDeleted.leftChild = nodeToDelete.leftChild;
      nodeNextToDeleted.leftChild.parent = nodeNextToDeleted;
    }

    if (nodeToDelete.rightChild !== null)
      return this.transplantNodes(nodeToDelete, nodeToDelete.rightChild);

    if (nodeToDelete.leftChild !== null)
      return this.transplantNodes(nodeToDelete, nodeToDelete.leftChild);
  }

  searchNodeRecursive(key: number, node?: OptionalTreeNode): TreeNode | null {
    let currentNode = node === undefined ? this.root : node;
    if (currentNode === null || currentNode.key === key) return currentNode;
    if (key < currentNode?.key) {
      return this.searchNodeRecursive(key, currentNode.leftChild);
    } else {
      return this.searchNodeRecursive(key, currentNode.rightChild);
    }
  }

  searchNodeIterate(key: number, node?: TreeNode | null): TreeNode | null {
    let currentNode = node === undefined ? this.root : node;
    while (currentNode !== null && currentNode.key !== key) {
      if (key < currentNode?.key) {
        return this.searchNodeIterate(key, currentNode.leftChild);
      } else {
        return this.searchNodeIterate(key, currentNode.rightChild);
      }
    }
    return currentNode;
  }

  getMinNode(node?: TreeNode) {
    if (!tree.root) return null;
    let currentNode = node ?? tree.root;
    while (currentNode.leftChild) {
      if (currentNode.leftChild !== null) {
        currentNode = currentNode.leftChild;
      }
    }
    return currentNode;
  }

  getMaxNode(node?: TreeNode) {
    if (!tree.root) return null;
    let currentNode = node ?? tree.root;
    while (currentNode.rightChild) {
      if (currentNode.rightChild !== null) {
        currentNode = currentNode.rightChild;
      }
    }
    return currentNode;
  }

  getPrevNode(key: number) {
    return this.searchNodeRecursive(key)?.parent;
  }

  getNextNode(key: number, node?: TreeNode | null) {
    let currentNode = node === undefined ? this.searchNodeIterate(key) : node;
    if (!currentNode) return;
    if (currentNode.rightChild !== null) {
      return this.getMinNode(currentNode.rightChild);
    }
    let y = currentNode.parent;
    while (
      y !== null &&
      y.rightChild !== null &&
      currentNode.key === y.rightChild.key
    ) {
      currentNode = y;
      y = y.parent;
    }
    return y;
  }
}

const consoleNode = (node?: OptionalTreeNode) => {
  console.table([
    {
      key: node?.key,
      leftChild: node?.leftChild?.key,
      rightChild: node?.rightChild?.key,
      parent: node?.parent?.key,
    },
  ]);
};

const initialArray = [3, 1, 2, 0, 5, 4, 6];

const tree = new BinaryTree();

initialArray.forEach((element) =>
  tree.insertNode(new TreeNode({ key: element })),
);

// tree.inOrderTraversal();

// const foundNodeIterate = tree.searchNodeIterate(5);
// consoleNode(foundNodeIterate);

// const foundNodeRecursive = tree.searchNodeRecursive(3);
// consoleNode(foundNodeRecursive);

// const foundMaxNode = tree.getMaxNode();
// consoleNode(foundMaxNode);

// const foundMinNode = tree.getMinNode();
// consoleNode(foundMinNode);

// const foundPrevNode = tree.getPrevNode(5);
// consoleNode(foundPrevNode);

// const foundNextNode = tree.getNextNode(0);
// consoleNode(foundNextNode);

// tree.removeNode(1);
// tree.inOrderTraversal();
