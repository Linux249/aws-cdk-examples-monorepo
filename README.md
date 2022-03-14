This repo is thought to memorize the first steps when learning to use AWS CDK. 

#  [rds-init-example](rds-init-example)
This is an example for an RDS instance witch will be call a docker lambda for initialisation of the Database. 


### Getting started 
https://bobbyhadz.com/blog/aws-cdk-tutorial-typescript
This guide shows the basics of using the AWS CDK with TypeScript as an StepByStep Guide. In includes a simple dev and production stack.

### S3 + CF
https://dev.to/ryands17/deploying-a-spa-using-aws-cdk-typescript-4ibf

### SPA
S3 with static web app, CF (+IAM for access to S3), Codebuild (github)
https://github.com/ryands17/spa-deploy-cdk

### Lambdas
https://bobbyhadz.com/blog/aws-cdk-lambda-function-example
Shows how to add lambdas to your Stack.

### Lambda Layer
https://bobbyhadz.com/blog/aws-cdk-lambda-layers
This show's how to create Layers for Lambda functions. They are used for code that comes 1) from own lib functions and 2) from nodemodules packages.

### Prisma Example 
https://github.com/aws-samples/prisma-lambda-cdk
With the basics above you can know understand this example for using prisma with AWS CDK.

Another Example: https://github.com/ryands17/prisma-lambda

### Fargete 
Run a nodejs/next-js service in Docker and sale via fargate.
https://medium.com/@srhise/deploying-next-js-on-aws-fargate-with-aws-cloud-development-kit-cdk-5b433257365c

##### EB for comparision (this also include the redirict to https stuff) 
https://dev.to/bnn1/deploying-dockerized-nextjs-app-to-aws-elastic-beanstalk-part-4-setting-redirects-48h9

##### Some tips to Docker 
https://blog.zack.computer/docker-containers-nodejs-nextjs#final-dockerfile


### More 
Didn't know why I had these both "open" anymore...
https://taimos.de/blog/build-a-basic-serverless-application-using-aws-cdk
https://taimos.de/blog/initializing-a-new-cdk-app




# Todo
What's missing is a good article about the hole private, sub-net, vpn and security of AWS.


# Not readed
https://ibrahimcesar.cloud/blog/full-stack-cloud-ssr-server-side-rendering-with-nextjs-tailwind-and-aws-cdk/
Seems covering several related topics together
