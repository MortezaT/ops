<!--
# 
# Online positioning system as final project for Shamsipour University Collage
# 
#
-->
# Online Positioning System

I know this is not a good Title for collage final project but the base of project was about to creating a small mobile app to make you confortable for adding addresses with their positions and be able to navigate to them, and if possible sharing them or other fun thing.

And I know this project is kind of school work and too easy but I tried to make a backbone for it and as you see I didn't use *AngularJS* or any other JavaScript framework.

This program uses jQuery Mobile for GUI. Accept my addvice this is not a good choice. I prefer Bootstrap or even fool kendo UI. most of widgets are experimental and need improvement and believe me you'll fasten your hands with a great chain if you use it. But there is some benefits of automation you can enjoy them like listview, page, header, footer, ... .

## Infra Structure
I've created a simple OO structure for my work and as start it uses inheritance (See Place.js which inherits database MyCRUD). Methods can became finalized and therefore method is protected against override.

My OO structure for a classes can be described like this:

- Methods
- Fields
- Constants

This infra structures using JavaScript Object defineProperty method to add prefered functionality to class which prevents accidental or intentional changes over object properties and add more protection and even further checkings can be seen in the future.
Here is the example:

```js
"use strict";
(function () {
	window.MyClass = function MyClass () {
		var that = this;
		Methods ({
			validate: function (){
				return that.GlobalField.length > 4;
			},
			greet: {
				final: true,
				callback: function (name) {
					return that.CONSTANT_VALUE + ", " + name;
				}
			}
		}, that);
		
		Fields ({
			globalField: "string",
			fieldOfTypeMyClass: "MyClass"
			anotherField: {type: "number", defaultValue: 3}
		}, that);

		Constants ({
			"constant value" : "Hello",
			"another constant": function () {
				return that.anotherField + 3
			},
		}, that);
	}
})();
```

### Methods
Adding method to class is available in two ways:
####1- Adding without extra configuration
>If a function assigned to a property it suposed to be the value of property and default options will be used as configuration and method can be overriden later.

####2- Adding with extra configuration
>If property value is an object then object.callback become the value of property and other configurations can be added to it.

#### Notes
- Currently there's only one config available which is final and if set to `true` method will freeze against changes.

### Fields
Just like methods, fields declaration can happens in two ways too.

#### Short way definition
Just type of field which can be primitive like `number, string, array, object` or any other types like user classes.

#### Long way definition
Object as value of property allow to add more configuration.
##### properties
- `type` is required to define field type.
- `defautValue` if set will be use as initial value for field.

#### Notes
- If default value didn't applied to a field value of the field will set to type default or null.
- type of default value of field won't checked.
- If type of assigned value to a field is not the same as it's type value, in current version new value will ignored and no error will shown or neither action take place.

### Constants
For now constants declared in one way and just by asigning value to property name.
#### Notes:
- If there is another way to access constant value you can change the value directly. In order to stop such infecting procedure value must assigned directly to property or for objects, `Object.create` method can be usefull.
- If using constants with reference you can alter them and use them as calculation fields.


### Auto naming convention
In order to clear differences of methods, fields, and constants some naming conventions are forced and automatically applied to properties.
`note`: this auto naming conventions will work correctly if using camelCase with lowercase first letter words. `(Constants naming is different)`.

>**1- Methods**: No changes on given name simply access myObject.methodName().

>**2- Fields**: First character will became uppercase and declared fildName can be accessed via object.FieldName.

>**3- Constants**: Normaly constants with multi word name are writing like this: `CONSTANT_FIELD`. To provide such a naming convention currently Constants property name must be space separated. Just like example and access to them can be like this: `that.ANOTHER_CONSTANT`.
	
## database
As database I used `localStorage` with a facade which adds functionalities to make it easy to use and allows to change `localStorage` with another db if needed.
`MyCRUD` (facade) needs more enhancment and documentation will be added later.
