# Metadata

# Project

## Steps

## Semantic Rules

### Data Types

There are pretty much 6 data types:

- Int
- Bool
- String
- IO
- Object
- Class-Based Types

Class-Based types are all extensions of the Object class. It is important to remember that these are blueprints, not exactly places in memory. Because of this, they must be instantiated beforehand. _The instantiation of something must be done in the semantic type checking part of the program._

#### Int

Basic integer class. Represents a number in memory.

#### Bool

Basic boolean class. Represents a boolean in memory. 1 byte in size because of how computers work. Optimizations may be done where multiple booleans are stored in the same byte. Nevertheless, it's a space vs performance kind of issue.

#### String

String class. Generic. Stores 24 bytes at first, but it works as a C-string, where the string ends where there is a null value. 24 bytes for those sizes that are not known at compile time.

#### IO

Basic I/O class. Doesn't have any size in memory. Gets and sets values through input. Is able to grab and print out values to the console.

#### Object

Object class used to manage other, more complex types. This class is **not generic**. Be mindful that this is the only class, out of all the other ones, that allows for inheritance. **All other classes don't allow inheritance**.

#### Class-Based Types

Every class is treated as a type. That means that the classes in the programs are blueprints altogether. Nevertheless, since they are objects, classes always inherit from the **Object** class, or from each other. Classes always have a direct path to the Object class in itself.

Since multiple inheritance is not allowed, that means that every class allows for specialization.

    class A {};

    class B extends A {};

    class C {
        returnA(instance: A): A { instance };
    }
    class Main {
        b: B <- new B;
        c: C <- new C;
        main(): Int {
            b <- c.returnA(b);
            0;
        }
    };

In the above example, we can see that `class C`'s method `returnA` accepts a parameter `instance` of type `A`, and later returns it. Nevertheless, we can also see that `class B extends A`, which means that `B` is of type `B`, but can be used anywhere where `A` is needed. Because the parser is a one-pass parser, `B` can only be of type `A` or `Object`, because `class C` has not been declared just yet.

### Data Types Information

| Data Type         | Size (Bytes) | Can be inherited | Inherits from |
| :---------------- | :----------: | :--------------: | :-----------: |
| Int               |      4       |        No        |     None      |
| Bool              |      1       |        No        |     None      |
| String            |      24      |        No        |     None      |
| IO                |      0       |        No        |     None      |
| Object            |      0       |       Yes        |     None      |
| Class-Based Types |    Varies    |       Yes        |    Object     |

## Memory Management

There are only two places where we can save stuff, but they must be managed for completely different situations: the **Stack** and the **Heap**. **It is important to note that every single new context can make use of any and all registers that are not reserved by the operative system.** For this, let's explore first how the registers are divided in `MIPS`:

| Register Number | Register Name |                        Description                         |
| :-------------: | :-----------: | :--------------------------------------------------------: |
|        0        |     $zero     |                        The value 0                         |
|       2-3       |   $v0 - $v1   | **V**alues from expression evaluation and function results |
|       4-7       |   $a0 - $a3   |         **A**rguments of a subroutine. Only four.          |
|   8-15, 24-25   |   $t0, $t9    |                  **T**emporary variables                   |
|      16-23      |    $s0-$s7    |    **S**aved values representing final computed results    |
|       31        |      $ra      |                   **R**eturn **A**ddress                   |

This means that, given just 31 values, we run out of every possible register to use, counting the reserved ones. We can only use 10 registers without using reserved values altogether. This also means that we need to recycle registers, or they would be overwritten. For example, let's say that we have the following piece of code inside of our main:

    .data

    .text
    main:
        li     $t0, 100            # Store the value 100 inside the register $t0
        jal     someFunction        # Jump to someFunction
        li     $v0, 10             # Asks the program to stop running
        syscall                     # Tell the OS

    someFunction:
        li     $t0, 200            # Store the value 200 inside the register $t0
        jal     someOtherFunction   # Jump to someOtherFunction
        jr      $ra                 # Go to the address saved in $ra. Because this was overridden by jal, it will loop in this instruction forever.

    someOtherFunction:
        add     $t0, $t0, $t0       # Add $t0 to itself
        jr      $ra                 # Go to the address saved in $ra. Returns to someFunction, after the jal

In the code above, two horrendous things are happening. First of all, `$t0` exists in more than one context at the same time. This means that, even though we expect it to have the value `100` at the end of the `main` function, it will hold the value `400`. Nevertheless, this does never happen because `jal` overwrites `$ra` everytime it's used. Because of this, the program will loop forever in the instruction `jr $ra`, inside the `someFunction` fragment.

### Stack

The stack is used in this program in a single situation: procedure calls. This basically means that all parameters are stored in the stack. The stack is literally treated as a stack as well. The following fragment of code is written in `YAPL`:

    class Main {
        addFiveNumbers( num1: Int, num2: Int, num3: Int, num4: Int, num5: Int ): Int {
            num1 + num2 + num3 + num4 + num5
        };

        main(): Int {
            addFiveNumbers(1, 2, 3, 4, 5)
        };
    };

This, in `MIPS` would look like this:

    .text
    main:
        addiu   $sp, $sp, -48       # Add 48 to the stack pointer
        sw      $ra, 40($sp)        # Save the return address to the stack (Notice that the return address is all the way to the bottom of the stack)
        li      $t0, 1              # load the value 1 into the register $t0
        sw      $t0, 32($sp)        # Store the value of t0 into the stack (Notice that the offset value decreases, not increases)
        li      $t0, 2              # Notice that t0 is recycled as well
        sw      $t0, 24($sp)
        li      $t0, 3
        sw      $t0, 16($sp)
        li      $t0, 4
        sw      $t0, 8($sp)
        li      $t0, 5
        sw      $t0, ($sp)
        jal     Main:addFiveNumbers
        lw      $ra, 40($sp)        # Load back the return address
        addiu   $sp, $sp, 48        # Return the stack to the same size as before the call
        move    $s0, $v0            # Save the result of the main's execution
        move    $v0, 10
        syscall                     # End the program



    Main::addFiveNumbers:
        lw      $t0, 32($sp)
        lw      $t1, 24($sp)
        add     $t0, $t0, $t1
        lw      $t1, 16($sp)        # Parameters are loaded as soon as they are used
        add     $t0, $t0, $t1
        lw      $t1, 8 ($sp)
        add     $t0, $t0, $t1
        lw      $t1, 0 ($sp)
        add     $t0, $t0, $t1
        move    $v0, $t0            # Save the return value
        jr      $ra                 # return to the calling function

The reason why we don't use `$a0-$a3` in this compiler, is because passing one to four arguments can be done through such methods, but not any subsequent arguments. Because of this, a lot more optimization would be required to use both the stack and the registers. Instead, we opted to use only the stack, as it is easier to manage.

Do notice as well that the instruction `addiu $sp, $sp, -48` is adding a negative number to the stack. This is because the **stack grows downwards, not upwards**.

### Heap

The heap works best for object permanence across procedures. Of course, this means that the heap can't be used all the time, or we would run into the risk of creating memory leaks. The heap is used, exclusively, to create instances of types. Procedures are saved in the `MIPS` source file, but the instances that save the properties are inside the heap.

An example of a program asking for heap memory would be:

    class A {};
    class Main {
        a: A <- new A;
        main(): Void {};
    }

The `new` keyword asks for heap memory. Since the class has no properties, it may be used to only access instance methods, such as an `Object`'s class. Nevertheless, this would look like this:

    .text
    main:
        li      $v0, 9      # $v0 <- 9 asks the system for memory
        li      $a0, 0      # The class has no size
        syscall             # Tell the system
        move    $t0, $v0    # $v0 now holds the address of the liberated memory
        li      $v0, 10     # End the program
        syscall

The program does nothing but ask for heap memory. Nevertheless, if the heap memory's address is lost, then it can't be liberated in a program. Nevertheless, `MIPS` throws a `runtime error` whenever we try to liberate it, so there is no way to liberate it as of now.

# Roadmap
