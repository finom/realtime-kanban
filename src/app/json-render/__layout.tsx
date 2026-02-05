/* // app/page.tsx
'use client';

import { DataProvider, ActionProvider, VisibilityProvider, Renderer, useUIStream } from '@json-render/react';
import { title } from 'process';
import { use } from 'react';
import { VovkRequest } from 'vovk';
import z from 'zod';

export default function Page({ children }: { children: React.ReactNode }) {



  return children;
}



using results = BatchRPC.batch({
  body: [
    UserRPC.updateUser.jsonrpc({
      id: 1,
      params: { id: '1234' },
      body: { email: 'aaa@ddd.com' }
    }),
    UserRPC.createUser.jsonrpc({
      id: 2,
      body: {
        name: 'Jojn Doe',
        email: 'eee@fff.com'
      }
    }),
  ],
});

for await (const item of results) {
  if(item.id === 1) {
    console.log(item.result)
  }
}


const [updateUserPromise, createUserPromise] = progressive(BatchRPC.batch, {
  body: [
    UserRPC.updateUser.jsonrpc({
      id: 1,
      params: { id: '1234' },
      body: { email: 'aaa@ddd.com' }
    }),
    UserRPC.createUser.jsonrpc({
      id: 2,
      body: {
        name: 'Jojn Doe',
        email: 'eee@fff.com'
      }
    }),
  ],
});



class BatchController {
  @post()
  static batch<B, Q, P>(req: VovkRequest<B, Q, P>) {

  } 

  static batch = createBatch({
    modules: { UserRPC },
  }) 
}

function createBatch<TModules>({ modules }: { modules: TModules }) {
  return function batch<B extends TModules['...body'], Q, P>(req: VovkRequest<B, Q, P>) {
    
  }
}

const sequence = [
  { call: 'UserRPC_updateUser', args: [{ params: { id: '$$userId', email: '$$form.email.value' }}], resultKey: '$updatedUser' },
  { eval: '$updatedUser.id', resultKey: '$userId'  },
  { call: 'TaskRPC_createTask', args: [{ params: { id: '$userId', taskName: '$$taskName', taskDescription: '$$form.taskDescription.value' }}], resultKey: '$createdTask' },
  // { exec: '$createdTask["id"]', resultKey: '$taskId' },
]
/*
$$xxx - input param
$xxx - previous result
'xxx' or { foo: 12345 } literal
* /
// Output: { $updatedUser: ..., $userId: ..., $createdTask: ..., $taskId: ... }

execActions({
  input: { userId, taskName },
  registry: { UserRPC_updateUser, TaskRPC_createTask },
  sequence,
});

/**
 * Prompt:
 * Map functions and their parameters with YAML
 * Describe syntax specifications for $$ - outer variables, $ - inner variables
 * Describe specifications for each phase
 * Describe available components in the registry
 * Include previously generated view(s) for more context
 * Phases:
 * - Initialize
 * {"ctxFromPath": {'userId': ''}, "ctxId": "12345"} for /12345
 * {"ctxFromPath": {'userId': 'user-', 'postId': 'post-', 'startDate': '', 'endDate': ''}, "ctxId": "user-12345/post-6789/2023-01-01/2023-01-31"} for /user-12345/post-6789/2023-01-01/2023-01-31
 * - Preload
 * {"id": "get-user", "call": "UserRPC_getUser", "params": { "id": "$ctx.userId" }, "ctxKey": "userData" }
 * - Generate UI (how to pass data???)
 * {"id":"main-card","type":"Card","props":{"title":"'Revenue' + ' Dashboard'","padding":"md"},"children":["metrics-grid","chart"]}}
 * {"id":"submit-button","type":"Button","props":{"variant":"primary","size":"md"},"children":["Submit"], "actions":{ onClick: ['update-user'] } }
 * - Generate Actions
 * {"id": "update-user", "call": "UserRPC_updateUser", "params": { "id": "$ctx.userId", "email": "$ctx.form.email.value" } }
 * - Generate Tests
 * - Execute Tests (goto 1)
 * 
 * 
 * -----
 * { "type": "element", "elementType": "Card", "props": `{ "title": "'Revenue' + ' Dashboard'", "padding": "md" }`, "children": [ ... ], "updatesOn": [ "$itemCtx.salesData" ], actions: { onChange: [{ "set": "$ctx.x" }, { "asyncExpr": "UserRPC.getUsers({ params: { id: $ctx.x }})", "set": "$ctx.data" }] } }
 * { "type": "list", "elementType": "Card", "props": `{ title: $itemCtx.item.title }`, "children": [ ... ], "updatesOn": [ "$itemCtx.item" ], "actions": { onClick: [{ "set": "$itemCtx
itemCtx.x" }, { "asyncExpr": "UserRPC.getUsers({ params: { id: $ctx.x }})", "set": "$ctx.data" }] } }
 * /


/*
{ "op": "component", "type": "element", "component": "Card", "props": `{ "title": "'Revenue' + ' Dashboard'", "padding": "md" }`, "children": [ ... ], "deps": [ "$itemCtx.salesData" ], actions: { onChange: [{ "set": "$ctx.x" }, { "expr": "UserRPC.getUsers({ params: { id: $ctx.x }})", "set": "$ctx.data" }] } }

{"op": "set", "val": {"target": "$ctx": "expr": "{count: 0}"}}
{"op": "component", "val": {"type": "element", "component": "Card", "props": `{ children: $ctx.count }`, "deps": [ "$ctx.count" ], "callbacks": { onClick: [{ "set": "$ctx.count", "expr": "$ctx.count + 1" }], onBeforeLoad: [{ "default": "$ctx.count": "literal": 0 } }] } } }
* /

const SuperInput = createSuperComponent({
  props: z.object({
    title: z.string(),
    placeholder: z.string().optional(),
    defaultValue: z.string(),
    ctxId: z.string(),
  }),
  callbacks: {
    onChange: z.object({
      value: z.string().meta({ description: 'New input value' }),
    })
  },
  description: "A super component that does everything",
  render: async (props) => {
    const ctx = useSuperContext(props.ctxId);
    const { newProps } = useEvalProps(props, ['title', 'placeholder', 'children', 'defaultValue'], ctx);

    /*
    const myState = useStore(
  (state) => state.complexObject,
  (a, b) => deepEqual(a, b) // custom equality fn
);
    * /

    // eval children only if string

    return <input {...newProps} />;
  },
});
*/
