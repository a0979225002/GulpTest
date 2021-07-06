// src/main.js
import foo from './foo.js';

class Function1 extends foo{

    add(a1, a2) {
        super.add(a1, a2);
        a1 = a1+10;
        return a1+a2;
    }
}

export default new Function1();