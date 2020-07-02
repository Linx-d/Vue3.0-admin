/**
 *
 * 树状数组
 */
export function translateDataToTree(data, parentId = 0) {
  let tree = [];
  let temp;
  data.forEach((item, index) => {
    if (data[index].pid == parentId) {
      let obj = data[index];
      temp = translateDataToTree(data, data[index].id);
      obj["label"] = obj["name"];
      if (temp.length > 0) {
        obj.children = temp;
        obj.childrenLen = obj.children.length;
      } else {
        obj.children = [];
        obj.childrenLen = obj.children.length;
      }
      tree.push(obj);
    }
  });
  return tree;
}
/**求数组的深度
 *
 */
export function getType(param) {
  return Object.prototype.toString
    .call(param)
    .slice(8, -1)
    .toLowerCase();
}

export function getObjLevel(obj) {
  /* 需要忽略数组时使用
  if(getType(obj) !== 'object'){
        throw new Error('paramater must be object')
    }
  */
  // 用来保存结果，初始化层级为0
  let res = 0;
  function loopGetLevel(obj, level = res) {
    //当前数据是不是对象，是对象就继续，否则比较下层级和值，哪个大取哪个
    if (typeof obj === "object") {
      //对对象的每个属性进行遍历，如果还是对象就递归计算，否则就比较res和level取最大值
      for (var key in obj) {
        if (typeof obj === "object") {
          if (Array.isArray(obj)) {
            loopGetLevel(obj[key], level); // 注意这里，当是数组时继续遍历，但是层数不增加
          } else {
            loopGetLevel(obj[key], level + 1);
          }
        } else {
          res = level + 1 > res ? level + 1 : res;
        }
      }
    } else {
      res = level > res ? level : res;
    }
  }
  loopGetLevel(obj);
  return res;
}

/**切换模块
 * contacts
 */
export function switchModule(data, current) {
  for(let key in data) {
    data[key] = false;
  }
  data[current] = true;
}