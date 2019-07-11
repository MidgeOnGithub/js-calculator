## The Third Odin on Rails JS [Project](https://www.theodinproject.com/courses/web-development-101/lessons/calculator)
This project is meant to demonstrate intermediate HTML, CSS, and JS knowledge.

### Reflections
Note that at this point in the course, OOP has not been discussed or practiced, thus this solution does not make attempts to use OOP objects or principles, and attempts a procedural approach with minimal globals.

Also, file modularity was not discussed within this course; I google this because I wanted to know out how to split my file and use imports like I would in other programming languages I've worked with, so that I can have one main file which imports miscellaneous functions. According to the several posts I found, this is a difficult and hairballed task in JavaScript, essentially requiring hacky code or an external framework solution in order to sanely split and import files/modules; this was upsetting to discover. I opted to stay within the depth of knowledge and toolset I was meant to use at this point in the course.

If I were to refactor or attempt to create "production" code from this project, I would first organize the function groups into one or more extra files; in doing so I would likely use JS's OOP features, especially for functions which only serve to pass on inputs to other functions. Then, I'd add: square root and exponent calculations; an operation memory stack; preserve information of trimmed numbers; and have the GUI react to keyboard input properly.
