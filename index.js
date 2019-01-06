const AWS = require('aws-sdk');
const _ = require('lodash');
const ini = require('ini');
const fs = require('fs');
const os = require('os');


// Global variables.
const E = process.env;
const DEFAULTS = {
  accessKeyId: E['AWS_ACCESS_KEY_ID'],
  secretAccessKey: E['AWS_SECRET_ACCESS_KEY'],
  region: E['AWS_DEFAULT_REGION']||'us-east-1',
  profile: E['AWS_PROFILE']||'default',
  sharedCredentialsFile: E['AWS_SHARED_CREDENTIALS_FILE']||'~/.aws/credentials',
  configFile: E['AWS_CONFIG_FILE']||'~/.aws/config'
};


// Load config from path.
function configLoad(pth, pro) {
  var z = {}, pth = pth.replace(/^\s*~/, os.homedir());
  if(!fs.existsSync(pth)) return z;
  var dat = fs.readFileSync(pth, 'utf8');
  if(pth.endsWith('.json')) return JSON.parse(dat);
  var cfg = ini.parse(dat);
  cfg = cfg[pro]||cfg;
  for(var k in cfg)
    z[_.camelCase(k.replace(/^aws_/, ''))] = cfg[k];
  return z;
};


// Global variables.
const SHARED_CREDENTIALS = DEFAULTS.sharedCredentialsFile.split(';').map(pth => configLoad(pth, DEFAULTS.profile));
const CONFIGS = DEFAULTS.configFile.split(';').map(pth => configLoad(pth, DEFAULTS.profile));


// Get param validation object.
function paramValidation(v) {
  return typeof v==='boolean'? {min: v, max: v, pattern: v, enum: v}:v||{};
};

// Get default options.
function defaults(o) {
  o.accessKeyId = o.accessKeyId||DEFAULTS.accessKeyId;
  o.secretAccessKey = o.secretAccessKey||DEFAULTS.secretAccessKey;
  o.region = o.region||DEFAULTS.region;
  return o;
};

/**
 * Get options from arguments.
 * This is to be called from arguments processing loop.
 * @param {object} o AWS options.
 * @param {string} k Argument key.
 * @param {array} a Argument array.
 * @param {integer} i Argument index.
 * @returns {integer} New argumemnt index.
 */
function options(o, k, a, i) {
  var e = k.indexOf('='), v = null, bool = () => true, str = () => a[++i];
  if(e>=0) { v = k.substring(e+1); bool = () => boolean(v); str = () => v; k = k.substring(o, e); }
  k = (k.startsWith('--')? '--'+k.replace(/[A-Za-z0-9]/g, ''):k).toLowerCase();
  if(k==='--help') o.help = bool();
  else if(k==='-aki' || k==='--accesskeyid') o.accessKeyId = str();
  else if(k==='-sak' || k==='--secretaccesskey') o.secretAccessKey = str();
  else if(k==='-r' || k==='--region') o.region = str();
  else if(k==='-mr' || k==='--maxretries') o.maxRetries = parseInt(str(), 10);
  else if(k==='-mf' || k==='--maxredirects') o.maxRedirects = parseInt(str(), 10);
  else if(k==='-se' || k==='--sslenabled') o.sslEnabled = bool();
  else if(k==='-pv' || k==='--paramvalidation') o.paramValidation = bool();
  else if(k==='-pvn' || k==='--paramvalidationmin') (o.paramValidation=paramValidation(o.paramValidation)).min = bool();
  else if(k==='-pvx' || k==='--paramvalidationmax') (o.paramValidation=paramValidation(o.paramValidation)).max = bool();
  else if(k==='-pvp' || k==='--paramvalidationpattern') (o.paramValidation=paramValidation(o.paramValidation)).pattern = bool();
  else if(k==='-pve' || k==='--paramvalidationenum') (o.paramValidation=paramValidation(o.paramValidation)).enum = bool();
  else if(k==='-cc' || k==='--computechecksums') o.computeChecksums = bool();
  else if(k==='-crt' || k==='--convertresponsetypes') o.convertResponseTypes = bool();
  else if(k==='-ccs' || k==='--correctclockskew') o.correctClockSkew = bool();
  else if(k==='-s3fps' || k==='--s3forcepathstyle') o.s3ForcePathStyle = bool();
  else if(k==='-s3be' || k==='--s3bucketendpoint') o.s3BucketEndpoint = true;
  else if(k==='-s3dbs' || k==='--s3disablebodysigning') o.s3DisableBodySigning = true;
  else if(k==='-hop' || k==='--httpoptionsproxy') (o.httpOptions=o.httpOptions||{}).proxy = bool();
  else if(k==='-hoct' || k==='--httpoptionsconnecttimeout') (o.httpOptions=o.httpOptions||{}).connectTimeout = bool();
  else if(k==='-hot' || k==='--httpoptionstimeout') (o.httpOptions=o.httpOptions||{}).timeout = bool();
  else if(k==='-hoxa' || k==='--httpoptionsxhrasync') (o.httpOptions=o.httpOptions||{}).xhrAsync = bool();
  else if(k==='-hoxwc' || k==='--httpoptionsxhrwithcredentials') (o.httpOptions=o.httpOptions||{}).xhrWithCredentials = bool();
  else if(k==='-av' || k==='--apiversion') o.apiVersion = str();
  else if(k==='-sco' || k==='--systemclockoffset') o.systemClockOffset = parseFloat(str());
  else if(k==='-sv' || k==='--signatureversion') o.signatureVersion = str();
  else if(k==='-sc' || k==='--signaturecache') o.signatureCache = bool();
  else if(k==='-ddc' || k==='--dynamodbcrc32') o.dynamoDbCrc32 = bool();
  else if(k==='-csm' || k==='--clientsidemonitoring') o.clientSideMonitoring = bool();
  else if(k==='-ede' || k==='--endpointdiscoveryenabled') o.endpointDiscoveryEnabled = bool();
  else if(k==='-ecs' || k==='--endpointcachesize') o.endpointCacheSize = parseInt(str(), 10);
  else if(k==='-hpe' || k==='--hostprefixenabled') o.hostPrefixEnabled = bool();
  else if(k==='-p' || k==='--profile') o.profile = str();
  else if(k==='-scf' || k==='--sharedcredentialsfile') o.sharedCredentialsFile = str();
  else if(k==='-cf' || k==='--configfile') o.configFile = str();
  else return i;
  return i+1;
};

/**
 * Get AWS Config with default options.
 * @param {object} o Custom options.
 */
function awsconfig(o) {
  o = defaults(Object.assign(o||{}, AWS.config));
  var i = Math.floor(65535*Math.random());
  Object.assign(o, SHARED_CREDENTIALS[i % SHARED_CREDENTIALS.length]);
  Object.assign(o, CONFIGS[i % CONFIGS.length]);
  console.log(o);
};

awsconfig.options = options;
module.exports = awsconfig;
