export default {
  props: [],
  emits: ['confirm'],
  data() {
      return {}
  },
  methods: {
    confirm() {
      this.$emit('confirm')
    }
  },
  template: `
    <div class="modal fade" id="change-driver-modal" tabindex="-1" role="dialog" aria-labelledby="changeDriverModal">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="exampleModalLabel">Duplicate Order</h4>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="recipient-name" class="control-label">Add To Driver:</label>
                <select id="select-driver" style="width: 100%;"></select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" @click="confirm">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  `
};
