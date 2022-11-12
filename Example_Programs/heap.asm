.data

.text
main:
	li	$v0, 9
	li	$a0, 4
	syscall
	move $t0, $v0
	li	$t1, 2
	sw	$t1, ($t0)
	li $v0, 9
	li $a0, -4
	syscall
	li	$v0, 10
	syscall