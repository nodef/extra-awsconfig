Get ready to use AWS Config from arguments and environment variables.
> Do you want to:
> - Have most of you AWS Config loaded from environment variables?
> - Handle JSON shared credentials and config files?
> - Get AWS Config from arguments?
<br>


## setup

1. Install [Node.js], if not installed.
2. Run `npm install -g extra-awsconfig` in console.
3. To install this as a package use `npm install extra-awsconfig`.
<br>


## console

```bash
awsconfig
# get default AWS config

awsconfig --access_key_id "..." --secret_access_key "..."
# get AWS config with custom credentials

awsconfig --accessKeyId "..." --secretAccessKey "..."
# get AWS config with custom credentials

awsconfig --accessKeyId "..." --secretAccessKey "..."
# get AWS config with custom credentials

awsconfig --sslEnabled=0
# get AWS config with SSL disabled

awsconfig -se
# get AWS config with SSL enabled
```

### reference

```bash
awsconfig [options]
# -> AWS config as JSON

# Options:
# --help: show this help
# -aki, --accesskeyid: your AWS access key ID
# -sak, --secretaccesskey: your AWS secret access key
# -r, --region: the region to send service requests to (us-east-1)
# -mr, --maxretries: the maximum amount of retries to attempt with a request
# -mf, --maxretries: the maximum amount of redirects to follow with a request
# -se, --sslenabled: whether to enable SSL for requests
# -pv, --paramvalidation: whether input parameters should be validated against the operation description before sending the request (true)
# -pvn, --paramvalidationmin: validates that a value meets the min constraint
# -pvx, --paramvalidationmax: validates that a value meets the max constraint
# -pvp, --: 
# -pve, --: 
# -cc, --: 
# -crt, --: 
# -ccs, --: 
# -s3fps, --: 
# -s3be, --: 
# -s3dbs, --: 
# -hop, --: 
# -hoct, --: 
# -hot, --: 
# -hoxa, --: 
# -hoxwc, --httpoptionsxhrwithcredentials: 
# -av, --apiversion: 
# -sco, --systemclockoffset: 
# -sv, --signatureversion: 
# -sc, --signaturecache: 
# -ddc, --dynamodbcrc32: 
# -csm, --clientsidemonitoring: 
# -ede, --endpointdiscoveryenabled: 
# -ecs, --endpointcachesize: 
# -hpe, --hostprefixenabled: 

  else if(k==='-' || k==='--') (o.paramValidation=paramValidation(o.paramValidation)).min = bool();
  else if(k==='-' || k==='--') (o.paramValidation=paramValidation(o.paramValidation)).max = bool();
  else if(k==='-' || k==='--paramvalidationpattern') (o.paramValidation=paramValidation(o.paramValidation)).pattern = bool();
  else if(k==='-' || k==='--paramvalidationenum') (o.paramValidation=paramValidation(o.paramValidation)).enum = bool();
  else if(k==='-' || k==='--computechecksums') o.computeChecksums = bool();
  else if(k==='-' || k==='--convertresponsetypes') o.convertResponseTypes = bool();
  else if(k==='-' || k==='--correctclockskew') o.correctClockSkew = bool();
  else if(k==='-' || k==='--s3forcepathstyle') o.s3ForcePathStyle = bool();
  else if(k==='-' || k==='--s3bucketendpoint') o.s3BucketEndpoint = true;
  else if(k==='-' || k==='--s3disablebodysigning') o.s3DisableBodySigning = true;
  else if(k==='-' || k==='--httpoptionsproxy') (o.httpOptions=o.httpOptions||{}).proxy = bool();
  else if(k==='-' || k==='--httpoptionsconnecttimeout') (o.httpOptions=o.httpOptions||{}).connectTimeout = bool();
  else if(k==='-' || k==='--httpoptionstimeout') (o.httpOptions=o.httpOptions||{}).timeout = bool();
  else if(k==='-' || k==='--httpoptionsxhrasync') (o.httpOptions=o.httpOptions||{}).xhrAsync = bool();
  else if(k==='-' || k==='--') (o.httpOptions=o.httpOptions||{}).xhrWithCredentials = bool();
  else if(k==='-' || k==='--') o.apiVersion = str();
  else if(k==='-' || k==='--') o.systemClockOffset = parseFloat(str());
  else if(k==='-' || k==='--') o.signatureVersion = str();
  else if(k==='-' || k==='--') o.signatureCache = bool();
  else if(k==='-' || k==='--') o.dynamoDbCrc32 = bool();
  else if(k==='-' || k==='--') o.clientSideMonitoring = bool();
  else if(k==='-' || k==='--') o.endpointDiscoveryEnabled = bool();
  else if(k==='-' || k==='--') o.endpointCacheSize = parseInt(str(), 10);
  else if(k==='-' || k==='--') o.hostPrefixEnabled = bool();
```


```javascript
const awsconfig = require('extra-awsconfig');

awsconfig();
// get default AWS config

awsconfig({region: 'us-west-1'});
// get AWS config with region="us-west-1"

var A = process.argv, o = {};
for(var i=0, I=A.length; i<I;)
  i = awsconfig.options(o, A[i], A, i);
awsconfig(o);
// get AWS config from arguments
```

### reference

```bash
# Environment variables:
$AWS_ACCESS_KEY_ID           # your AWS access key ID
$AWS_SECRET_ACCESS_KEY       # your AWS secret access key
$AWS_DEFAULT_REGION          # region to send service requests to
$AWS_PROFILE                 # profile with the credentials and options to use
$AWS_SHARED_CREDENTIALS_FILE # one or more access keys files (~/.aws/credentials)
$AWS_CONFIG_FILE             # one or more configuration files (~/.aws/config)

# Arguments:
## for awsconfig.options():
## 
```


