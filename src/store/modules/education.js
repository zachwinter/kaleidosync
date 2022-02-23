import { buildModule } from '@zach.winter/vue-common/util/store'
import { setting, types } from '@/util/settings'

const educated = setting('educated', false, types.boolean, { session: true });

const state = {
  get educated() { return educated.get() },
  set educated(value) { educated.set(value) },
}

const actions = {

}

export default buildModule({ state, actions })