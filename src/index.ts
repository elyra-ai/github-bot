/*
 * Copyright 2018-2020 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Application } from 'probot' // eslint-disable-line no-unused-vars

export = (app: Application) => {
  app.on('pull_request.opened', async (context) => {
    const head = context.payload.pull_request.head;
    const ref = encodeURIComponent(head.ref);
    const user = head.user.login;
    const repo = head.repo.name;

    const comment = `Thanks for making a pull request to Elyra!

To try out this branch on [binder](https://mybinder.org), follow this link: [![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/${user}/${repo}/${ref}?urlpath=lab/tree/binder-demo)`
    const issueComment = context.issue({ body: comment })
    await context.github.issues.createComment(issueComment)
  });

  // Add triage label to all newly opened issues
  app.on('issues.opened', async (context) => {
    const issueLabels = context.issue({
        labels: ['status:Needs Triage']
      })
    await context.github.issues.addLabels(issueLabels)
  });

//  // Remove triage label when an issue is added to a milestone
//  app.on('issues.milestoned', async (context) => {
//    const issueLabels = context.issue({
//        label: ['status:Needs Triage']
//      })
//    await context.github.issues.removeLabels(issueLabels)
//  });
}
