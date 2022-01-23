// File generated at Mon Jan 17 2022 16:11:29 GMT+1300 (New Zealand Daylight Time)

// Includes
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Predefs
char*read_file(char*fn){FILE*fp;long s;char*b="";fp=fopen(fn,"rb");fseek(fp,0,SEEK_END);s=ftell(fp);rewind(fp);b=calloc(1,s+1);fread(b,s,1,fp);return b;};
int split_string(char*i,char*d,char*b[]){char*t=strtok(i,d);int in=0;while(t!=NULL){b[in]=t;in++;t=strtok(NULL,d);}return in;};

// Transpiled Code
#define buffer_length  10000

void main( int argc, char* argv[] ) {
    char* input = read_file ( argv[1] );
    char* buffer[ buffer_length ];
    int length = split_string ( input, "\n", buffer );

    for ( int i = 0; i < length; i++ ) {
        
    };
};