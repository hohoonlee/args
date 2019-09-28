## args
- Clean Code 14장에 나온 Args.java를 node.js로 구현해 본 산출물
```
onst args = require('args');
const parsed = args('p#', process.argv);
console.log(parsed.getInt('p'));
```