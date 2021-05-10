# Caesar-cipher-CLI-tool
The application implements the Caesar cipher with the ability to adjust the shift.
You can read more about this encryption method [here](https://en.wikipedia.org/wiki/Caesar_cipher)

### how to start: 
write in your terminal:
1. ```git clone https://github.com/SixStringer91/Caesar-cipher-CLI-tool.git```
2. ```git checkout develop```
3. ```npm i```
4. ```node my_caesar_cli -a encode -s 1 -i input.txt -o output.txt```
### commands: 
* action type: ```-a encode``` | ```-a decode``` (definitely);
* shift: ```-s(or --shift) number``` (definitely);
* path to input: ```-i (or --input) 'some path'```(can be done without quotes);
* path to output:```-o (or --output) 'some path'```(can be done without quotes);


You can also create your own files. To do this, create them in the root of the program and specify their name in the console.  

If there are no input or output files in the directory, the work can be continued in the console. Also you can use a negative value for shift;


### example:
```node my_caesar_cli -a encode -s 7 -i input.txt -o output.txt```
```node my_caesar_cli -a encode -s -7 -o output.txt```
```node my_caesar_cli -a decode -s -7 -i input.txt```

If you have some questions, you can write me in [telegram](https://t.me/SixStringer436) or discord (Danzig#2654)



