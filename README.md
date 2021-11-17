Get ready to use [AWS Config] from arguments and environment variables.
> Do you want to:
> - Have most of you AWS Config loaded from environment variables?
> - Handle JSON shared credentials and config files?
> - Get AWS Config from arguments?

<br>
<br>


## Setup

1. Run `npm install -g extra-awsconfig` in console.
2. To install this as a package use `npm install extra-awsconfig`.

<br>
<br>


## Console

```bash
awsconfig
# get default AWS config

awsconfig --access_key_id "..." --secret_access_key "..."
awsconfig --accessKeyId "..." --secretAccessKey "..."
awsconfig --id "..." --key "..."
# get AWS config with custom credentials
## all commands are equivalent

awsconfig --region "us-west-1"
# get AWS config with region="us-west-1"

awsconfig --sslEnabled=0
# get AWS config with SSL disabled
## enable SSL with simply --sslEnabled

awsconfig --profile dev
# get AWS config with "dev" profile
## credential and config associated with the profile is loaded

awsconfig --credentialsFile credentials.json
# use a custom credentials file
## credentials/config file can be INI for JSON
```


### Reference

```bash
awsconfig [options]
# -> AWS config as JSON

# Options:
# --help: show this help
# -i, --id:       set your AWS access key ID
# -k, --key:      set your AWS secret access key
# -e, --endpoint: set the endpoint to send service requests to
# -r, --region:   set the region to send service requests to (us-east-1)
# -p, --profile:  set the AWS config profile to use (default)
# -f, --file:             set custom AWS config file path
# -cf, --credentialsFile: set custom AWS credentails file path
# ...: for more options check AWS Config options below

# Environment variables:
$AWS_ACCESS_KEY_ID           # set your default AWS access key ID
$AWS_SECRET_ACCESS_KEY       # set your default AWS secret access key
$AWS_DEFAULT_REGION          # set default region to send service requests to (us-east-1)
$AWS_PROFILE                 # set default AWS config profile to use (default)
$AWS_SHARED_CREDENTIALS_FILE # set default AWS credentails file path (~/.aws/credentials)
$AWS_CONFIG_FILE             # set default AWS config file path (~/.aws/config)

# Credential/Config file (INI):
[default]
aws_access_key_id = ...
aws_secret_access_key = ...
region = us-east-1
...

# Credential/Config file (JSON, default profile):
{
  "accessKeyId": "...",
  "secretAccessKey": "...",
  "region": "us-east-1",
  ...
}

# Credential/Config file (JSON, multi-profile):
{
  "profiles": true,
  "default": {
    "accessKeyId": "...",
    "secretAccessKey": "...",
    "region": "us-east-1",
    ...
  },
  "dev": { ... },
  ...
}
```
> See [AWS Config] options.

<br>
<br>


## Package

```javascript
const awsconfig = require('extra-awsconfig');

awsconfig();
// get default AWS config

awsconfig({accessKeyId: '...', secretAccessKey: '...'});
// get AWS config with custom credentials

awsconfig({region: 'us-west-1'});
// get AWS config with region="us-west-1"

awsconfig({sslEnabled: false});
// get AWS config with SSL disabled

awsconfig({profile: 'dev'});
// get AWS config with "dev" profile

awsconfig({credentialsFile: 'credentials.json'});
// use a custom credentials file
/// credentials/config file can be INI for JSON

var A = process.argv, o = {};
for(var i=0, I=A.length; i<I;)
  i = awsconfig.options(o, A[i], A, i);
awsconfig(o);
// get AWS config from arguments
```


### Reference

```javascript
const awsconfig = require('extra-awsconfig');

awsconfig.options(options, argument_key, arguments, index);
// options: target object to store AWS config options
// argument_key: name of the argument (ex: "--help")
// arguments: arguments array (ex: process.argv)
// index: current index in arguments array (ex: i=2...args.length)
// -> new index in arguments array


awsconfig(options);
// options: custom AWS config options
// -> AWS config options

// Default options:
options = {
  file: '~/.aws/config',                 // set custom AWS config file path
  credentialsFile: '~/.aws/credentials', // set custom AWS credentails file path
  ... /* for more options check AWS Config options below */
};
```
> See [AWS Config] options.

<br>
<br>


## Similar

Do you need anything similar?
> - [extra-amazontranslate] can translate long text to target language.
> - [extra-amazontts] can generate speech from text.

Suggestions are welcome. Please [create an issue].

<br>
<br>


[![nodef](https://i.imgur.com/eO4zcjv.jpg)](https://nodef.github.io)
> References: [AWS Config], [AWS CLI environment variables].

[AWS Config]: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor_details
[extra-amazontranslate]: https://www.npmjs.com/package/extra-amazontranslate
[extra-amazontts]: https://www.npmjs.com/package/extra-amazontts
[create an issue]: https://github.com/nodef/extra-awsconfig/issues
[AWS CLI environment variables]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html
