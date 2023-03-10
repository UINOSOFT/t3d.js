import { WebGLProperties } from './WebGLProperties.js';

class WebGLMaterials extends WebGLProperties {

	constructor(passId, programs) {
		super(passId);

		const that = this;

		function onMaterialDispose(event) {
			const material = event.target;
			const materialProperties = that.get(material);

			material.removeEventListener('dispose', onMaterialDispose);

			const program = materialProperties.program;

			if (program !== undefined) {
				programs.releaseProgram(program);
				// TODO release vaos
			}

			that.delete(material);
		}

		this._onMaterialDispose = onMaterialDispose;
	}

	setMaterial(material) {
		const materialProperties = this.get(material);

		if (materialProperties.program === undefined) {
			material.addEventListener('dispose', this._onMaterialDispose);
		}

		// Set program in render pass

		return materialProperties;
	}

}

export { WebGLMaterials };