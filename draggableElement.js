let startPosition = {
    x: 0,
    y: 0
}

const modifyCursor = (e) => {
    e.preventDefault();
    e.dataTransfer.effectAllowed = 'all';
    e.dataTransfer.dropEffect = 'copy';
}

const modifyCursorWithExtras = (selector, isAdd) => {
    let dom = document.querySelectorAll(selector);
    dom && dom.forEach(item => {
        isAdd ? item.addEventListener('dragover', modifyCursor) : item.removeEventListener('dragover', modifyCursor);
    })
}

/**
 * v-dragElement = {
 * @event dragstart 拖拽开始
 * @event drag 拖拽中
 * @event dragend 拖拽结束
 * @param selector 选择器， 虽然给window上添加drag移入事件修改光标样式，但是有的第三方组件库的不生效，这里手动传入选择器进行设置
 * 
 * }
 */
const dragElement = {
    bind(el, binding) {
        // 记录元素原本的draggable
        el.originalDraggable = el.draggable;
        !el.originalDraggable && (el.draggable = true);

        el.dragstart = (e) => {
            // 修改拖拽光标的样式
            window.addEventListener('dragover', modifyCursor);
            window.addEventListener('dragenter', modifyCursor);
            modifyCursorWithExtras(binding.value.selector, true);

            startPosition.x = e.offsetX;
            startPosition.y = e.offsetY
            binding.value.dragstart && binding.value.dragstart(e, binding);
        }

        el.dragend = (e) => {
            let fixedPos = {
                x: e.pageX - startPosition.x,
                y: e.pageY - startPosition.y
            }
            binding.value.dragend && binding.value.dragend(e, binding, fixedPos);
        }

        el.drag = (e) => {
            binding.value.drag && binding.value.drag(e, binding);
        }

        // 给元素绑定事件
        el.addEventListener('dragstart', el.dragstart);
        el.addEventListener('dragend', el.dragend);
        el.addEventListener('drag', el.drag);

    },
    unbind(el, binding) {
        modifyCursorWithExtras(binding.value.selector, true);
        window.removeEventListener('dragover', modifyCursor);
        window.removeEventListener('dragenter', modifyCursor);
        // 给元素解绑事件
        el.removeEventListener('dragstart', el.dragstart);
        el.removeEventListener('dragend', el.dragend);
        el.removeEventListener('drag', el.drag);
        // 恢复元素原本的draggable
        el.draggable = el.originalDraggable;
    }
}

export {
    dragElement
}