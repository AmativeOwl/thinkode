CC = gcc
CFLAGS = -Wall -Wextra -Werror -std=c11 -g -Wpedantic
LDLIBS = -lm

# Windows executables get a .exe suffix; on Linux/macOS this is empty
ifeq ($(OS),Windows_NT)
    EXE = .exe
else
    EXE =
endif
RM = rm -f

TEST_BIN = test_zpd$(EXE)

.PHONY: all test clean

# default target: build everything
all: zpd.o $(TEST_BIN)

zpd.o: zpd.c zpd.h
	$(CC) $(CFLAGS) -c zpd.c -o $@

test_zpd.o: test_zpd.c zpd.h
	$(CC) $(CFLAGS) -c test_zpd.c -o $@

$(TEST_BIN): test_zpd.o zpd.o
	$(CC) $(CFLAGS) $^ -o $@ $(LDLIBS)

# build and run the test harness
test: $(TEST_BIN)
	./$(TEST_BIN)

clean:
	$(RM) *.o $(TEST_BIN)
