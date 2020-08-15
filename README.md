This is the home of the Openhouse project, a version of Clubhouse that's being built 100% in the open.

The GitHub is home for all code related to Openhouse. If, however, you don't care much for code but still want to follow along, check out the substack: https://openhouse.substack.com

There is an accompanying server-side repository that lives here: https://github.com/nickgarfield/openhouse-server

# Developer Onboarding

We use [Feather](https://feather.id) for Authentication. In order for to run locally, you will need to tweak the Feather publishable key in `src/apis/feather.js` such that it corresponds to your own Feather project.

To get started locally:

```bash
yarn install
yarn dev
# go to localhost:3000
```

For this setup to work, you'll also need a backend server running (see [repo](https://github.com/nickgarfield/openhouse-server))
