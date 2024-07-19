import { IsEmail, validate } from 'class-validator'
import items from './items.json'


class Email {
  @IsEmail()
  mailcl: string
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
      console.log('validation failed. errors: ', errors);
    } else {
      console.log('validation succeed');
    }
  });
})