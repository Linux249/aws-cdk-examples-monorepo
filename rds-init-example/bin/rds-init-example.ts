#!/usr/bin/env node

import * as cdk from '@aws-cdk/core'
import { RdsInitStackExample } from '../demos/rds-init-example'

const app = new cdk.App()

/* eslint no-new: 0 */
new RdsInitStackExample(app, 'RdsInitExample')
