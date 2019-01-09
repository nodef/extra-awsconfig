#!/usr/bin/env node
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
  file: E['AWS_CONFIG_FILE']||'~/.aws/config',
  credentialsFile: E['AWS_SHARED_CREDENTIALS_FILE']||'~/.aws/credentials'
};


// Load config from path.
function configLoad(pth) {
  pth = pth.replace(/^\s*~/, os.homedir());
  if(!fs.existsSync(pth)) return {};
  var dat = fs.readFileSync(pth, 'utf8');
  if(pth.endsWith('.json')) return JSON.parse(dat);
  var cfg = ini.parse(dat), ans = {profiles: true};
  for(var p in cfg) {
    var ap = ans[p]={};
    for(var k in cfg[p])
      ap[_.camelCase(k.replace(/^aws_/, ''))] = cfg[p][k];
  }
  return ans;
};

// Load configs from multiple paths.
function configsLoad(pth) {
  return pth.split(';').map(p => configLoad(p));
};

// Get config for profile.
function configProfile(cfg, pro) {
  return cfg.profiles? cfg[pro||'default']:cfg;
};


// Global variables.
const CONFIGS = configsLoad(DEFAULTS.file);
const CREDENTIALS = configsLoad(DEFAULTS.credentialsFile);


// Get default options.
function defaults(o) {
  o.accessKeyId = o.accessKeyId||DEFAULTS.accessKeyId;
  o.secretAccessKey = o.secretAccessKey||DEFAULTS.secretAccessKey;
  o.region = o.region||DEFAULTS.region;
  o.profile = o.profile||DEFAULTS.profile;
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
  var kc = _.camelCase(k); k = (k.startsWith('--')? '--'+kc:k);
  if(k==='--help') o.help = bool();
  else if(k==='-i' || k==='--id') o.accessKeyId = str();
  else if(k==='-k' || k==='--key') o.secretAccessKey = str();
  else if(k==='-e' || k==='--endpoint') o.endpoint = str();
  else if(k==='-r' || k==='--region') o.region = str();
  else if(k==='-p' || k==='--profile') o.profile = str();
  else if(k==='-f' || k==='--file') o.file = str();
  else if(k==='-cf' || k==='--credentialsFile') o.credentialsFile = str();
  else if(kc in AWS.config) o[kc] = typeof AWS.config[kc]==='boolean'? bool():str();
  else o.argv = a[i];
  return i+1;
};

/**
 * Get AWS Config with default options.
 * @param {object} o Custom options.
 */
function awsconfig(o) {
  var p = defaults(Object.assign({}, AWS.config));
  var i = Math.floor(65535*Math.random());
  var cre = o.credentialsFile? configsLoad(o.credentialsFile):CREDENTIALS;
  var cfg = o.file? configsLoad(o.file):CONFIGS;
  Object.assign(p, configProfile(cre[i % cre.length], o.profile));
  Object.assign(p, configProfile(cfg[i % cfg.length], o.profile));
  return Object.assign(p, o);
};

awsconfig.options = options;
module.exports = awsconfig;


// Run on shell.
function shell(a) {
  for(var i=2, I=a.length, o={}; i<I;)
    i = options(o, a[i], a, i);
  console.log(awsconfig(o));
};
if(require.main===module) shell(process.argv);
