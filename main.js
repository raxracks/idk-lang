const bindings = {
    "num": {"behaviour": "replace", "replace": [["num", "int"]], "semicolon": true},
    "cnum": {"behaviour": "replace", "replace": [["cnum", "const int"]], "semicolon": true},
    "cfloat": {"behaviour": "replace", "replace": [["cfloat", "const float"]], "semicolon": true},
    "fn": {"behaviour": "replace", "replace": [["fn : ", ""]], "semicolon": false},
    "print": {"behaviour": "replace", "replace": [["print", "printf"]], "semicolon": true, "includes": ["<stdio.h>"]},
    "string": {"behaviour": "replace", "replace": [["string", "char*"]], "semicolon": true},
    "#include": {"semicolon": false},
    "read_file": {"behaviour": "extern", "content": `char*read_file(char*fn){FILE*fp;long s;char*b="";fp=fopen(fn,"rb");fseek(fp,0,SEEK_END);s=ftell(fp);rewind(fp);b=calloc(1,s+1);fread(b,s,1,fp);return b;};`, "semicolon": true, "includes": ["<stdio.h>", "<stdlib.h>"]},
    "write_file": {"behaviour": "extern", "content": `void write_file(char*fn,char*c){FILE*fp;fp=fopen(fn,"w+");fprintf(fp,c);};`, "semicolon": true, "includes": ["<stdio.h>"]},
    "split_string": {"behaviour": "extern", "content": `int split_string(char*i,char*d,char*b[]){char*t=strtok(i,d);int in=0;while(t!=NULL){b[in]=t;in++;t=strtok(NULL,d);}return in;};`, "semicolon": true, "includes": ["<stdio.h>", "<string.h>"]},
    "def": {"behaviour": "replace", "replace": [["def", "#define"], ["=", ""]], "semicolon": false},
    "for": {"semicolon": false}
}

const input = await Deno.readTextFile(Deno.args[0]);
const lines = input.split("\n");
const output_lines = [];
const includes = [];
const externs = [];

lines.forEach(line => {
    output_lines.push(translate(line));
});

Deno.writeTextFile("temp.c", `// File generated at ${new Date()}\n\n// Includes\n${includes.join("\n")}\n\n// Predefs\n${externs.join("\n")}\n\n// Transpiled Code\n${output_lines.join("\n")}`);

const compile = Deno.run({ cmd: ["gcc", "temp.c", "-o", Deno.args[1]] });
await compile.status();

if(!Deno.args[2] || Deno.args[2] !== "yes")
    Deno.remove("temp.c");

function translate(line) {
    let output_line = line;
    let semicolon = true;

    line.split(" ").forEach(word => {
        const binding = bindings[word];

        if(binding) {
            const behaviour = binding["behaviour"];
            
            switch(behaviour) {
                case "replace":
                    binding["replace"].forEach(replace_data => {
                        output_line = output_line.split(replace_data[0]).join(replace_data[1]);
                    });

                    break;

                case "extern":
                    externs.push(binding["content"]);
                    
                    break;
            }

            if(!binding["semicolon"]) { 
                semicolon = false;
            }

            if(binding["includes"]) {
                binding["includes"].forEach((include) => {
                    if(!includes.includes(`#include ${include}`)) includes.push(`#include ${include}`);
                });
            }
        }
    });

    if(semicolon && line.trim().length > 0) output_line += ";";

    return output_line;
}