//page 1

> list of products w.r.t. clothing

- http://localhost:9800/1

> list of products w.r.t. electronics

- http://localhost:9800/2

> list of products w.r.t. brands

- http://localhost:9800/?brandId:1

//page 2

> list of products w.r.t. product type

- http://localhost:9800/filter/1

> list of products w.r.t. brands

- http://localhost:9800/filter/1?brandId=2

> list of products w.r.t. price

- http://localhost:9800/filter/1?lcost=1000&&hcost=10000

> list of products w.r.t. discount

- http://localhost:9800/filter/1?mindiscount=30&&maxdiscount=70

> list of products w.r.t. brand and price

- http://localhost:9800/filter/1?lcost=1000&&hcost=10000&&brandId=2

//page 3

> details of product

- http://localhost:9800/details/3

//page 4

> place order

- http://localhost:9800/placeOrder

//page 5

> list of order details based on email

- http://localhost:9800/orders/gp.com

> update order payment details

- http://localhost:9800/updateOrder

> delete order

- http://localhost:9800/deleteOrder?id=637d05f7fbe97ed4d890d117
