"""
================================================================================
Space Station Safety Object Detection - Inference Script
================================================================================
Simple and powerful inference script for testing the trained YOLOv8m model.

Features:
    - Single image or batch inference
    - Automatic confidence thresholding
    - Bounding box visualization
    - Support for multiple image formats
    - Optional Test-Time Augmentation (TTA) for enhanced accuracy
    
Usage:
    # Basic inference on single image
    python predict.py --source test_images/image.jpg --model results/improved_model/train/weights/best.pt
    
    # Batch inference on folder
    python predict.py --source test_images/ --model results/improved_model/train/weights/best.pt
    
    # With custom confidence threshold
    python predict.py --source test_images/ --model results/improved_model/train/weights/best.pt --conf 0.3
    
    # With Test-Time Augmentation for better accuracy on real images
    python predict.py --source test_images/ --model results/improved_model/train/weights/best.pt --tta
    
    # Save predictions to custom directory
    python predict.py --source test_images/ --model results/improved_model/train/weights/best.pt --output predictions/
    
Author: SafeOrbit AI Team
Date: 2025-10-22
Version: 1.0.0
================================================================================
"""

import argparse
import sys
from pathlib import Path
from typing import Optional, Union, List
import cv2
import numpy as np
from ultralytics import YOLO
import torch
from datetime import datetime

# Add scripts to path
sys.path.append(str(Path(__file__).parent / 'scripts'))
try:
    from inference_tta import TTAPredictor
    TTA_AVAILABLE = True
except ImportError:
    TTA_AVAILABLE = False
    print("⚠️  TTA not available. Install dependencies for Test-Time Augmentation.")


class ObjectDetectionPredictor:
    """
    Production-grade inference pipeline for Space Station Safety Object Detection.
    """
    
    def __init__(
        self,
        model_path: str,
        conf_threshold: float = 0.25,
        iou_threshold: float = 0.45,
        device: Optional[str] = None,
        use_tta: bool = False
    ):
        """
        Initialize predictor.
        
        Args:
            model_path: Path to trained YOLO model (.pt file)
            conf_threshold: Confidence threshold for detections (0-1)
            iou_threshold: IoU threshold for Non-Maximum Suppression
            device: Device to use ('cpu', 'cuda', '0', '1', etc.). Auto-detect if None
            use_tta: Use Test-Time Augmentation for better accuracy
        """
        self.model_path = Path(model_path)
        if not self.model_path.exists():
            raise FileNotFoundError(f"Model not found: {self.model_path}")
        
        self.conf_threshold = conf_threshold
        self.iou_threshold = iou_threshold
        self.use_tta = use_tta and TTA_AVAILABLE
        
        # Auto-detect device if not specified
        if device is None:
            self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        else:
            self.device = device
        
        # Load model
        print(f"Loading model from: {self.model_path}")
        print(f"Using device: {self.device}")
        
        if self.use_tta:
            print("🚀 Using Test-Time Augmentation for enhanced accuracy")
            self.predictor = TTAPredictor(
                str(self.model_path),
                conf_threshold=conf_threshold,
                iou_threshold=iou_threshold,
                use_tta=True
            )
            self.model = self.predictor.model
        else:
            self.model = YOLO(str(self.model_path))
            self.model.to(self.device)
        
        # Get class names
        self.class_names = self.model.names
        print(f"✅ Model loaded successfully!")
        print(f"📦 Classes: {list(self.class_names.values())}")
        print()
    
    def predict_image(
        self,
        image_path: Union[str, Path],
        save_output: bool = True,
        output_dir: Optional[Path] = None
    ) -> dict:
        """
        Run inference on a single image.
        
        Args:
            image_path: Path to input image
            save_output: Whether to save annotated image
            output_dir: Directory to save output (default: predictions/)
            
        Returns:
            Dictionary with predictions and metadata
        """
        image_path = Path(image_path)
        if not image_path.exists():
            raise FileNotFoundError(f"Image not found: {image_path}")
        
        # Read image
        image = cv2.imread(str(image_path))
        if image is None:
            raise ValueError(f"Failed to read image: {image_path}")
        
        # Run inference
        if self.use_tta:
            results = self.predictor.predict_single(image, preprocess=True)
        else:
            results = self.model.predict(
                source=image,
                conf=self.conf_threshold,
                iou=self.iou_threshold,
                device=self.device,
                verbose=False
            )[0]
        
        # Extract predictions
        predictions = self._extract_predictions(results)
        
        # Save annotated image if requested
        if save_output:
            if output_dir is None:
                output_dir = Path('predictions')
            output_dir.mkdir(parents=True, exist_ok=True)
            
            # Draw predictions on image
            annotated_image = self._draw_predictions(image.copy(), predictions)
            
            # Save
            output_path = output_dir / f"{image_path.stem}_predicted{image_path.suffix}"
            cv2.imwrite(str(output_path), annotated_image)
            print(f"💾 Saved: {output_path}")
        
        return {
            'image_path': str(image_path),
            'image_size': image.shape[:2],
            'predictions': predictions,
            'num_detections': len(predictions)
        }
    
    def predict_batch(
        self,
        source_dir: Union[str, Path],
        save_output: bool = True,
        output_dir: Optional[Path] = None,
        extensions: List[str] = ['.jpg', '.jpeg', '.png', '.bmp']
    ) -> List[dict]:
        """
        Run inference on all images in a directory.
        
        Args:
            source_dir: Directory containing images
            save_output: Whether to save annotated images
            output_dir: Directory to save outputs
            extensions: Image file extensions to process
            
        Returns:
            List of prediction dictionaries
        """
        source_dir = Path(source_dir)
        if not source_dir.exists():
            raise FileNotFoundError(f"Directory not found: {source_dir}")
        
        # Find all images
        image_files = []
        for ext in extensions:
            image_files.extend(source_dir.glob(f"*{ext}"))
            image_files.extend(source_dir.glob(f"*{ext.upper()}"))
        
        if not image_files:
            print(f"⚠️  No images found in {source_dir}")
            return []
        
        print(f"📁 Found {len(image_files)} images")
        print()
        
        # Process each image
        all_predictions = []
        for img_path in image_files:
            print(f"Processing: {img_path.name}...")
            try:
                pred = self.predict_image(img_path, save_output, output_dir)
                all_predictions.append(pred)
                print(f"  ✅ Detected {pred['num_detections']} objects")
            except Exception as e:
                print(f"  ❌ Error: {str(e)}")
            print()
        
        return all_predictions
    
    def _extract_predictions(self, results) -> List[dict]:
        """Extract predictions from YOLO results."""
        predictions = []
        
        if hasattr(results, 'boxes'):
            boxes = results.boxes
            for i in range(len(boxes)):
                pred = {
                    'class_id': int(boxes.cls[i]),
                    'class_name': self.class_names[int(boxes.cls[i])],
                    'confidence': float(boxes.conf[i]),
                    'bbox': boxes.xyxy[i].cpu().numpy().tolist()  # [x1, y1, x2, y2]
                }
                predictions.append(pred)
        
        return predictions
    
    def _draw_predictions(self, image: np.ndarray, predictions: List[dict]) -> np.ndarray:
        """Draw bounding boxes and labels on image."""
        # Color palette for different classes
        colors = [
            (255, 0, 0),    # OxygenTank - Blue
            (0, 255, 0),    # NitrogenTank - Green
            (0, 0, 255),    # FirstAidBox - Red
            (255, 255, 0),  # FireAlarm - Cyan
            (255, 0, 255),  # SafetySwitchPanel - Magenta
            (0, 255, 255),  # EmergencyPhone - Yellow
            (128, 0, 128),  # FireExtinguisher - Purple
        ]
        
        for pred in predictions:
            class_id = pred['class_id']
            class_name = pred['class_name']
            confidence = pred['confidence']
            x1, y1, x2, y2 = map(int, pred['bbox'])
            
            # Get color
            color = colors[class_id % len(colors)]
            
            # Draw bounding box
            cv2.rectangle(image, (x1, y1), (x2, y2), color, 2)
            
            # Draw label background
            label = f"{class_name} {confidence:.2f}"
            (label_w, label_h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 1)
            cv2.rectangle(image, (x1, y1 - label_h - 10), (x1 + label_w, y1), color, -1)
            
            # Draw label text
            cv2.putText(image, label, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
        
        return image


def main():
    """Main entry point for inference script."""
    parser = argparse.ArgumentParser(
        description="Space Station Safety Object Detection - Inference",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Single image
  python predict.py --source test.jpg --model results/improved_model/train/weights/best.pt
  
  # Batch inference
  python predict.py --source test_images/ --model results/improved_model/train/weights/best.pt
  
  # With TTA for better accuracy
  python predict.py --source test_images/ --model results/improved_model/train/weights/best.pt --tta
  
  # Custom confidence threshold
  python predict.py --source test.jpg --model results/improved_model/train/weights/best.pt --conf 0.3
        """
    )
    
    parser.add_argument(
        '--source',
        type=str,
        required=True,
        help='Path to image file or directory containing images'
    )
    
    parser.add_argument(
        '--model',
        type=str,
        default='results/improved_model/train/weights/best.pt',
        help='Path to trained model file (.pt)'
    )
    
    parser.add_argument(
        '--conf',
        type=float,
        default=0.25,
        help='Confidence threshold (0-1). Default: 0.25'
    )
    
    parser.add_argument(
        '--iou',
        type=float,
        default=0.45,
        help='IoU threshold for NMS (0-1). Default: 0.45'
    )
    
    parser.add_argument(
        '--device',
        type=str,
        default=None,
        help='Device to use (cpu, cuda, 0, 1, etc.). Auto-detect if not specified'
    )
    
    parser.add_argument(
        '--output',
        type=str,
        default='predictions',
        help='Output directory for predictions. Default: predictions/'
    )
    
    parser.add_argument(
        '--tta',
        action='store_true',
        help='Use Test-Time Augmentation for enhanced accuracy on real images'
    )
    
    parser.add_argument(
        '--no-save',
        action='store_true',
        help='Do not save annotated images'
    )
    
    args = parser.parse_args()
    
    # Print header
    print("=" * 80)
    print("🛰️  Space Station Safety Object Detection - Inference")
    print("=" * 80)
    print()
    
    # Initialize predictor
    try:
        predictor = ObjectDetectionPredictor(
            model_path=args.model,
            conf_threshold=args.conf,
            iou_threshold=args.iou,
            device=args.device,
            use_tta=args.tta
        )
    except Exception as e:
        print(f"❌ Error loading model: {str(e)}")
        return 1
    
    # Run inference
    source = Path(args.source)
    output_dir = Path(args.output) if not args.no_save else None
    
    try:
        if source.is_file():
            # Single image
            print(f"🔍 Running inference on: {source}")
            print()
            result = predictor.predict_image(source, not args.no_save, output_dir)
            
            # Print results
            print()
            print("=" * 80)
            print("📊 RESULTS")
            print("=" * 80)
            print(f"Image: {result['image_path']}")
            print(f"Detections: {result['num_detections']}")
            print()
            if result['predictions']:
                print("Detected objects:")
                for i, pred in enumerate(result['predictions'], 1):
                    print(f"  {i}. {pred['class_name']} (confidence: {pred['confidence']:.3f})")
            else:
                print("No objects detected.")
        
        elif source.is_dir():
            # Batch inference
            print(f"🔍 Running batch inference on: {source}")
            print()
            results = predictor.predict_batch(source, not args.no_save, output_dir)
            
            # Print summary
            print()
            print("=" * 80)
            print("📊 SUMMARY")
            print("=" * 80)
            print(f"Total images processed: {len(results)}")
            total_detections = sum(r['num_detections'] for r in results)
            print(f"Total detections: {total_detections}")
            if results:
                avg_detections = total_detections / len(results)
                print(f"Average detections per image: {avg_detections:.2f}")
        
        else:
            print(f"❌ Error: {source} is neither a file nor a directory")
            return 1
        
        print()
        print("✅ Inference completed successfully!")
        if not args.no_save:
            print(f"📁 Predictions saved to: {output_dir}")
        print()
        
        return 0
        
    except Exception as e:
        print(f"❌ Error during inference: {str(e)}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
