import { bind } from '@zach.winter/vue-common/util/store'

export default {
  computed: {
    ...bind(['ui/uniform', 'ui/editingUniform']),
    hidden () {
      return this.editingUniform && this.uniform !== this.value.name
    }
  }
}