
export default {
  components: {
  },
  props: ['order'],
  template: `
    <div class="panel panel-default driver" style="height: fit-content;">
      <div class="panel-heading">
        <h3 class="panel-title" style="font-weight: 600;" v-html="'Order 61 - Sunway HDL (Zone 1)'"></h3>
      </div>
      <table class="table">
        <tbody class="sortable">
          <!-- Orders -->
          <tr>
            <td>
              <div class="order" style="display: flex; justify-content: space-between;">
                <!-- Driver -->
                <div class="handle" style="width: 90%">Driver A</div>
                <!-- Dropdown-->
                <div style="position: relative; width: 5%; cursor: pointer">
                  <i class="fa fa-ellipsis-h" style="font-size: 15px" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                  <ul class="dropdown-menu" aria-labelledby="dLabel">
                    <li class="order-option">Set Main</li>
                  </ul>
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <td>
              <div class="order helper" style="display: flex; justify-content: space-between;">
                <!-- Driver -->
                <div class="handle" style="width: 90%">Driver B</div>
                <!-- Dropdown-->
                <div style="position: relative; width: 5%; cursor: pointer">
                  <i class="fa fa-ellipsis-h" style="font-size: 15px" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                  <ul class="dropdown-menu" aria-labelledby="dLabel">
                    <li class="order-option">Set Main</li>
                  </ul>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>    
  `
};
