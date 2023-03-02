import { WebGLProperties } from './WebGLProperties.js';

// This class handles buffer creation and updating for geometries.
class WebGLGeometries extends WebGLProperties {

	constructor(passId, gl, buffers, vertexArrayBindings) {
		super(passId);

		this._gl = gl;
		this._buffers = buffers;
		this._vertexArrayBindings = vertexArrayBindings;

		const that = this;

		function onGeometryDispose(event) {
			const geometry = event.target;
			const geometryProperties = that.get(geometry);

			geometry.removeEventListener('dispose', onGeometryDispose);

			if (geometry.index !== null) {
				buffers.removeBuffer(geometry.index.buffer);
			}

			for (const name in geometry.attributes) {
				buffers.removeBuffer(geometry.attributes[name].buffer);
			}

			for (const name in geometry.morphAttributes) {
				const array = geometry.morphAttributes[name];
				for (let i = 0, l = array.length; i < l; i++) {
					buffers.removeBuffer(array[i].buffer);
				}
			}

			vertexArrayBindings.releaseByGeometry(geometry);

			geometryProperties.created = false;

			that.delete(geometry);
		}

		this._onGeometryDispose = onGeometryDispose;
	}

	setGeometry(geometry) {
		const gl = this._gl;
		const buffers = this._buffers;

		const geometryProperties = this.get(geometry);

		if (!geometryProperties.created) {
			geometry.addEventListener('dispose', this._onGeometryDispose);
			geometryProperties.created = true;
		}

		if (geometry.index !== null) {
			buffers.setBuffer(geometry.index.buffer, gl.ELEMENT_ARRAY_BUFFER, this._vertexArrayBindings);
		}

		for (const name in geometry.attributes) {
			buffers.setBuffer(geometry.attributes[name].buffer, gl.ARRAY_BUFFER);
		}

		for (const name in geometry.morphAttributes) {
			const array = geometry.morphAttributes[name];
			for (let i = 0, l = array.length; i < l; i++) {
				buffers.setBuffer(array[i].buffer, gl.ARRAY_BUFFER);
			}
		}

		return geometryProperties;
	}

}

export { WebGLGeometries };