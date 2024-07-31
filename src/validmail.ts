import { IsEmail, validate } from 'class-validator'
import items from './items.json'
const fs = require('fs')

class Email {
  @IsEmail()
  mailcl: string

  A1_COD: string
}

let parsedItems = items.items.map(item => {
  const email = new Email()
  email.mailcl = item.mailcl
  return email
})

parsedItems.map(item => {
  validate(item).then(errors => {
    // errors is an array of validation errors
    if (errors.length > 0) {
	  const content = "insert into erromail(A1_COD, mailcl) values('" + item.A1_COD + "', '" + item.mailcl + "');\n";

	  // fs.appendFile("mail.txt", content, { flag: 'a+' }, err => {});
	  fs.appendFile('mail.txt', content, { flag: 'a+' }, (err: Error) => {
          if (err) {
            console.error('Error writing to file', err);
          }
        });
		
    } else {
    }
  });
})