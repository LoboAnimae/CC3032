#include <iostream>

class A {
    int z =  int(35);
    int a =  int(0);
    int b =  int(0);

    public:
    int add(int c, int d) {
        return int((a * c) + (b * d));
    }
    A() {}
    int getA() {
        return a;
    }

    int getB() {
        return b;
    }

};

class Main {
    public:
    int e = int(3);
    int f = int(2);
    A g = A();
    int main() {
        f = g.add(e, f);
        return 0;
    }
};

int main() {
    // Main().main();
    std::cout << sizeof(Main) + sizeof(A) << std::endl;
    return 0;
}