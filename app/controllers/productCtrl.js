const {
  getSumOfProducts,
  getOrder,
  getPaymentMethods,
  updatePaymentMethod,
  getSumOfProdsSQL
} = require("../models/Product.js")
const prompt = require('prompt');
const colors = require("colors/safe");
const {
  red,
  magenta,
  blue
} = require("chalk");

const { displayWelcome } = require('../ui.js');

module.exports.completeAPayment = (customerId) => {
  getOrder(customerId).then((orderId) => {
    getSumOfProdsSQL(orderId[0].order_id).then((sum) => {

      if (sum[0]['sum(product.price* product.quantity)'] === 0) {
        console.log("Please add products to your order");
        displayWelcome();

      } else {

        let headerDivider = `${magenta('*********************************************************')}`
        return new Promise((resolve, reject) => {
          console.log(`
      ${headerDivider}
      ${magenta(`** Your Current Order Total is ${sum[0]['sum(product.price* product.quantity)']}, ready to purhase?**`)}
      ${headerDivider}`)
          prompt.get([{
            name: 'choice',
            description: '(Y/N)',
            type: 'string',
            message: "please select Y or N"
          }], function (err, results) {
            if (err) return reject(err);
            if (results.choice === "Y") {
              getPaymentMethods(customerId).then((payment) => {
                if (payment.length === 0) {
                  console.log("please add payments to your account")
                } else {
                  return new Promise((resolve, reject) => {
                    console.log(`${headerDivider}${(`Choose a payment option`)}${headerDivider}`);
                    for (i = 0; i < payment.length; i++) {
                      console.log(`${i+1} . ${payment[i].payment_option}`);
                    };
                    prompt.get([{
                      name: "Choice",
                      description: `enter number of the payment you would like to select`,
                      type: 'integer',
                      message: 'enter number of payment you would like to select'
                    }], function (err, results) {
                      if (err) return reject(err);
                      if (results.Choice === 1) {
                        updatePaymentMethod(payment[0].payment_id, orderId[0].order_id)
                          .then((data) => {
                            console.log("payment completed");
                          })
                      } else if (results.Choice === 2) {
                        updatePaymentMethod(payment[1].payment_id, orderId[0].order_id)
                          .then((data) => {
                            console.log("payment completed");
                            displayWelcome();
                          })
                      } else {
                        updatePaymentMethod(payment[2].payment_id, orderId[0].order_id)
                          .then((data) => {
                            console.log("payment completed");
                            displayWelcome();
                          })
                      }
                    })

                  })

                }
              })
            } else {
              console.log("You chose to not complete your order!")
            }
          });
        });
      }
    })
  })
}