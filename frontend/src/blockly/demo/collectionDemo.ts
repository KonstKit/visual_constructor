export const collectionDemoXml = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="collection_reduce" x="20" y="20">
    <field name="OP">SUM</field>
    <field name="FIELD"></field>
    <value name="COLLECTION">
      <block type="collection_map">
        <field name="VAR">n</field>
        <value name="COLLECTION">
          <block type="collection_filter">
            <field name="VAR">n</field>
            <value name="COLLECTION">
              <block type="lists_create_with">
                <mutation items="3" />
                <value name="ADD0"><block type="math_number"><field name="NUM">1</field></block></value>
                <value name="ADD1"><block type="math_number"><field name="NUM">2</field></block></value>
                <value name="ADD2"><block type="math_number"><field name="NUM">3</field></block></value>
              </block>
            </value>
            <value name="CONDITION">
              <block type="logic_compare">
                <field name="OP">GT</field>
                <value name="A"><block type="variables_get"><field name="VAR">n</field></block></value>
                <value name="B"><block type="math_number"><field name="NUM">1</field></block></value>
              </block>
            </value>
          </block>
        </value>
        <value name="TRANSFORM">
          <block type="math_arithmetic">
            <field name="OP">MULTIPLY</field>
            <value name="A"><block type="variables_get"><field name="VAR">n</field></block></value>
            <value name="B"><block type="math_number"><field name="NUM">10</field></block></value>
          </block>
        </value>
      </block>
    </value>
  </block>
</xml>`
