const factory = require("./FactoryHandler");
const Order = require("../Models/Order");
const CatchAsync = require("../utils/CatchAsync");
const http = require("http");

exports.index = factory.index(Order);
exports.create = factory.create(Order);
exports.show = factory.show(Order);
exports.update = factory.update(Order);
exports.delete = factory.delete(Order);

exports.payment = CatchAsync(async (req, res, next) => {
  const data = JSON.stringify({
    payeePaymentReference: "0123456789",
    callbackUrl: "https://myfakehost.se/swishcallback.cfm",
    payerAlias: "4671234768",
    payeeAlias: "1234679304",
    amount: "100",
    currency: "SEK",
    message: "Kingston USB Flash Drive 8 GB",
  });

  const options = {
    hostname: "mss.cpc.getswish.net",
    path: "/swish-cpcapi/api/v1/paymentrequests",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };

  try {
    const req = http.request(options, (response) => {
      let responseData = "";

      response.on("data", (chunk) => {
        responseData += chunk;
      });

      response.on("end", () => {
        console.log("Response:", responseData);

        if (response.statusCode === 201) {
          const paymentRequestToken = response.headers.paymentrequesttoken;
          return { id: responseData.id, token: paymentRequestToken };
        }
      });
    });

    req.on("error", (error) => {
      console.error("Error:", error);
      res.send(error);
    });

    req.write(data);
    req.end();
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});
