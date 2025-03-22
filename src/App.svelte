<script lang="ts">
  import { createMatrixWithArrayValue, createMatrixWithStringValue, MatrixBuilder } from "./lib/data-matrix";
  import { extractSchemaFromObjects, type ObjectSchema } from "./lib/object-schema";
  import { search } from 'jmespath';

  let textarea: HTMLTextAreaElement;
  let schema: ObjectSchema | null = $state.raw(null);
  let idKey: string = $state('');
  let valueKey: string = $state('');
  let dataMatrix: MatrixBuilder | null = $state.raw(null);
  let query: string = $state('@');

  function readJsonValue(): Record<string, any>[] {
    return search(JSON.parse(textarea.value), query);
  }

  function analyze() {
    const objects = readJsonValue();
    schema = extractSchemaFromObjects(objects);
    idKey = schema.stringsKeys.values().find(() => true) || '';
    valueKey = schema.stringArraysKeys.values().find(() => true) || '';
  }

  function showTable() {
    if (schema?.stringsKeys.has(valueKey)) {
      dataMatrix = createMatrixWithStringValue(schema.objs, idKey, valueKey);
    } else if (schema?.stringArraysKeys.has(valueKey)) {
      dataMatrix = createMatrixWithArrayValue(schema.objs, idKey, valueKey);
    }
  }
</script>

<main>
  <section>
    <textarea bind:this={textarea}></textarea>
    <label for="query">JMESPath Query</label>
    <input id="query" bind:value={query} />
    <button onclick={analyze}>Analyze</button>
  </section>

  {#if schema}
    <section>
      <label for="idfld">ID Field</label>
      <select id="idfld" bind:value={idKey}>
        {#each schema.stringsKeys as field }
          <option>{field}</option>
        {/each}
      </select>

      <label for="valfld">Value Field</label>
      <select id="valfld" bind:value={valueKey}>
        {#each schema.stringsKeys as field }
          <option>{field}</option>
        {/each}
        {#each schema.stringArraysKeys as field }
          <option>{field}</option>
        {/each}
      </select>
      <button onclick={showTable}>Show Table</button>
    </section>
  {/if}

  {#if dataMatrix}
    <section class="with-table">
      <table>
        <thead>
          <tr>
            <th></th>
            {#each dataMatrix.ids as id }
              <th>{id}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each dataMatrix.map as [k, vs] }
            <tr>
              <td>{k}</td>
              {#each dataMatrix.ids as id}
                <td>{vs.has(id) ? '✓' : ''}</td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </section>
  {/if}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: 2em;
    padding: 1em;
    margin: 0 auto;
  }

  section {
    display: flex;
    flex-direction: column;
    width: 40em;
    margin: 0 auto;
  }

  section.with-table {
    width: inherit;
    overflow: scroll;
  }

  textarea {
    min-height: 20rem;
  }

  table {
    font-size: .8rem;
    border-collapse: collapse;
  }

  thead {
    background-color: #333333;
    color: #aaaaaa;
  }

  tbody {
    text-align: center;
  }

  tbody tr:hover {
    background-color: #444444;
  }

  th {
    max-width: 6em;
    padding: 1em;
    word-wrap: break-word;
  }

  td {
    border: 1px solid #555555;
    padding: 1em;
  }
</style>
